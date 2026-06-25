import { fileServices } from '/src/api/api.js'
import { appstate } from '/src/appstate/appstate.js'
import {events, emit, ON} from '/src/events/events.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'


import {EditorState, RangeSetBuilder, StateField} from "@codemirror/state"
import {EditorView, keymap,highlightSpecialChars, drawSelection, Decoration} from "@codemirror/view"
import {defaultKeymap, history, historyKeymap} from "@codemirror/commands"
import {markdown} from "@codemirror/lang-markdown"
import {languages} from "@codemirror/language-data"
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";





export function codeMirror () {

    const middleBody = get("codeMirror.js", "middle" ,"middleBody")
    
    middleBody.replaceChildren()

    const codeMirrorContainer = document.createElement("div")
    codeMirrorContainer.id = "editor-container"
    middleBody.append(codeMirrorContainer)

    const textStyling = HighlightStyle.define ([
    { tag: t.heading1, fontWeight: "bold", fontSize: "1.6em", textAlign: "center" },
    { tag: t.heading2, fontWeight: "bold", fontSize: "1.4em" },
    { tag: t.heading3, fontWeight: "bold", fontSize: "1.2em" },
    { tag: t.keyword, fontWeight: "bold" },
    { tag: t.string, color: "#98c379" }, 
    { tag: t.comment, fontStyle: "italic", },
    { tag: t.link,textDecoration: "underline" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.strong, fontWeight: "bold" }
    ])


    //This will be the function to send the content to go backend
    let timeout =  null
    const content = EditorView.updateListener.of((ViewUpdate) => {
        if(ViewUpdate.docChanged) {
            if(timeout) {
                clearTimeout(timeout)
            }
            timeout = setTimeout(() => {
                const content = view.state.doc.toString()
                const filePath = appstate.file.path

                fileServices.SAVE_FILE("codeMirror.js", content, filePath)
            }, 500)
        }
    })


    // Hiding the ID from the chapters
        const secretWord = /<--!([\s\S]*?)-->/g // Define the word to be hidden
    /*
    Okay so this one is going to weird because the code is written by gemini but i wii
    try my best to make this code understanable
    */
    
    const hideDecoration = Decoration.mark({
        attributes: {
            style: "opacity: 0.5; background-color: rgba(150, 150, 150, 0.1); pointer-events: none; user-select: none;"
        }
    });
    // const hideDecoration = Decoration.replace({});  
    // Decoration.replace is a class from CM that replace the given the passed decoration with the content
    // from the {} in it 

    function findRangesToHide(state) { // This function will take the initial state from statefield and run its regex on it, 
        
        const builder = new RangeSetBuilder(); // making a new RangeSetBuilder class 
        const text = state.doc.toString(); //Turning the argument of state to text

        const regex = secretWord
        let match; // Empty match will use next

        for(const match of text.matchAll(regex)) {  // Lookes for every instace of the regex
            const start = match.index;  // Okay so this seems to be giving the starting character position in the string
            // From google When you use a Regular Expression method like exec() or match(),
            //  the resulting object includes an .index property. 
            // It represents the zero-based position where the match was found in the original string
            
            const end = start + match[0].length; 
            //Okay so this is basically saying take the starting position of the regex in the string
            // Then count the characters in the word itself starting from the [0] index of the word
            //Add them up togeather to get the last character position
            
            // so if we have a string (Rabbit outran the turtle) and we want to get the starting and ending position of the word outran
            //We first regex it using exec and matchAll, then using .index on the result will give 7 the position where the word starts in the string.
            //Then we calculate the total number of characters in the word with word[0] means start from the 0th position, .length, give the full length of 6
            // Then with the starting postion of 7 and the word length of 6 we can get the ending position of 13
            // So the range of the word in the string becoms 7 to 13

        builder.add(start, end, hideDecoration) 
        //Now this class will take the starting position, the Ending Position, and the replaceing object
        //Whic is empty in our case and does its thing

        }
        return builder.finish();
         // The function took state, and returned the range set like 7 to 13 in the example above, this range set will
         // be used to tell other extentions on where the word exist on the editor
    }

    const textHiderExtention = StateField.define({  
        //Now we use statefield to keep the hidden data stateful
        create(state) { // Create by default takes the initial editor state
            return findRangesToHide(state) 
            // And it will send that to the function we made, the return value of the function will be used as the initial value
            // of the editor
            // This actually only run when the editor first loads
        }, 
        // Now Update looks for any changes in the editor state
        // compute a new value from the previous value and the current transaction
        update(decoration, transaction) {
            // ...Not much to say but comment for the sake of comment
            if(transaction.docChanged) {
                return findRangesToHide(transaction.state) 
                // Same thing as current but for every update, the return value or rangeSet is stored in decoration
            }
            // Now we are applying the transaction changes on the decoration state???
            // .map is some kind of calculator that calulates where to apply the decorations
            // Like if a user put some characters behind the the secret word then map will calculate how far the word moved and where to 
            // apply the decoraion again
            return decoration.map(transaction.changes) 
        },
        // now provide takes the field which i am assuming is the returned value from the update function
        // From is a facet
        //EditorView class is the the editor view in state
        // the decorations plugin takes in a decoration set
        // with from facet that takes in the field and apllies it
        // I have no idea
        // There are two parts the state and editor view
        // The decorations lives in the state and EditorView doesn't know it
        // Provide acts like a bridge that let the View get the decorations from the state
        provide: (field) => EditorView.decorations.from(field)
    })

    //Same function as before but this time we are only getting the end position
    //We will use the end position as a border between protected words and user area
    function getMetadataEndPosition(state) {
        const text = state.doc.toString();
        for (const match of text.matchAll(secretWord)) {
            return match.index + match[0].length;
        }
        return 0;
    }
const fortifyMetadataExtension = EditorState.transactionFilter.of((tr) => {
    if (!tr.docChanged) return tr; // If no text changed, let the navigation pass safely

    const metadataEnd = getMetadataEndPosition(tr.startState);
    if (metadataEnd === 0) return tr;

    let transactionBlocked = false;
    let modifiedChanges = [];

    tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
        // CASE 1: User tries to paste/type at position 0, or inside the metadata zone
        if (fromA < metadataEnd) {
            
            // Allow typing/pasting ONLY if it happens strictly AFTER the metadata boundary.
            // If they select an area that spans across the boundary, we truncate the change
            // so it only applies to the story area.
            if (toA > metadataEnd) {
                modifiedChanges.push({
                    from: metadataEnd,
                    to: toA,
                    insert: inserted
                });
            } else {
                // Completely block any insertion/typing that is 100% inside the ID zone
                transactionBlocked = true;
            }
        } 
        // CASE 2: The change is safely out in the story wilderness. Let it ride.
        else {
            modifiedChanges.push({ from: fromA, to: toA, insert: inserted });
        }
    });

    // If an illegal paste or type event inside the ID zone was detected, kill the transaction
    if (transactionBlocked && modifiedChanges.length === 0) {
        return [];
    }

    return {
        changes: modifiedChanges,
        selection: tr.selection
    };
});




    const editorExtentions = [
            highlightSpecialChars(),
            history(),
            drawSelection(),
            syntaxHighlighting(textStyling),
            markdown(),
            textHiderExtention,
            fortifyMetadataExtension,
            content,
            
            keymap.of([
        ...defaultKeymap,
        ...historyKeymap
            ])
    ]

    ON(events.file.req.read,{callback: readFile})

async function readFile() {
    const filePath = appstate.file.path
    if (!filePath) {
        return "<--! No file is opened -->"
    }

    const content = await fileServices.READ_FILE("codemirror.js", filePath)
    view.setState(EditorState.create({
        doc: content.data,
        extensions: editorExtentions
    }))

    const line = view.state.doc.line(2)
    const offset = line.from

    view.dispatch({
        selection: {anchor: offset},
        effects: EditorView.scrollIntoView(offset, { y: "center"})
    })
    // view.focus()
}


    let state = EditorState.create({
        doc: "<--! No file is opened -->", 
        extensions: editorExtentions
    })

    let view = new EditorView({
        state: state,
        parent: codeMirrorContainer
    })
    
}




