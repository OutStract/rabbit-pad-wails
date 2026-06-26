import { fileServices } from '/src/api/api.js'
import { appstate } from '/src/appstate/appstate.js'
import { events, emit, ON } from '/src/events/events.js'
import { register, get, skeleton } from '/src/appstate/skeleton.js'

import { EditorState, RangeSetBuilder, StateField } from "@codemirror/state"
import { EditorView, keymap, highlightSpecialChars, drawSelection, Decoration } from "@codemirror/view"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { markdown } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// --- MOVE VARIABLE SCOPES TO MODULE LEVEL SO READFILE CAN ACCESS THEM SAFELY ---
let view;
let editorExtensions = [];
const secretWord = /<--!([\s\S]*?)-->/g;

// --- REGISTER THE EVENT EXPLICITLY ONCE AT THE MODULE LEVEL ---
ON(events.file.req.read, { callback: readFile })


async function readFile() {
    const filePath = appstate.file.path
    console.log("STEP 4",appstate.file.path)
    if (!filePath) return;

    try {
        const content = await fileServices.READ_FILE("codemirror.js", filePath)        
        // Safety check to ensure view exists before trying to assign state
        if(!content) return
        
        if (view) {
            view.setState(EditorState.create({
                doc: content.data || "",
                extensions: editorExtensions
            }))

            const totalLines = view.state.doc.lines;
            const targetLine = totalLines >= 2 ? 2 : 1;
            const line = view.state.doc.line(targetLine)
            const offset = line.from

            view.dispatch({
                selection: { anchor: offset },
                effects: EditorView.scrollIntoView(offset, { y: "center" })
            })
            view.focus()
        }
    } catch (err) {
        console.error("Error setting file contents:", err);
    }
}

// --- MAIN WRAPPER FUNCTION ---
export function codeMirror() {
    console.log("STEP 3",appstate.file.path)
    const middleBody = get("codeMirror.js", "middle", "middleBody")
    middleBody.replaceChildren()

    const codeMirrorContainer = document.createElement("div")
    codeMirrorContainer.id = "editor-container"
    middleBody.append(codeMirrorContainer)

    const textStyling = HighlightStyle.define([
        { tag: t.heading1, fontWeight: "bold", fontSize: "1.6em", textAlign: "center" },
        { tag: t.heading2, fontWeight: "bold", fontSize: "1.4em" },
        { tag: t.heading3, fontWeight: "bold", fontSize: "1.2em" },
        { tag: t.keyword, fontWeight: "bold" },
        { tag: t.string, color: "#98c379" },
        { tag: t.comment, fontStyle: "italic" },
        { tag: t.link, textDecoration: "underline" },
        { tag: t.emphasis, fontStyle: "italic" },
        { tag: t.strong, fontWeight: "bold" }
    ])

    let timeout = null
    const contentListener = EditorView.updateListener.of((ViewUpdate) => {
        if (ViewUpdate.docChanged) {
            if (timeout) clearTimeout(timeout)
            timeout = setTimeout(() => {
                const contentStr = view.state.doc.toString()
                const filePath = appstate.file.path
                fileServices.SAVE_FILE("codeMirror.js", contentStr, filePath)
            }, 500)
        }
    })

    const hideDecoration = Decoration.mark({
        attributes: {
            style: "opacity: 0.5; background-color: rgba(150, 150, 150, 0.1); pointer-events: none; user-select: none;"
        }
    });

    function findRangesToHide(state) {
        const builder = new RangeSetBuilder();
        const text = state.doc.toString();
        for (const match of text.matchAll(secretWord)) {
            const start = match.index;
            const end = start + match[0].length;
            builder.add(start, end, hideDecoration)
        }
        return builder.finish();
    }

    const textHiderExtension = StateField.define({
        create(state) { return findRangesToHide(state) },
        update(decoration, transaction) {
            if (transaction.docChanged) return findRangesToHide(transaction.state)
            return decoration.map(transaction.changes)
        },
        provide: (field) => EditorView.decorations.from(field)
    })

    function getMetadataEndPosition(state) {
        const text = state.doc.toString();
        for (const match of text.matchAll(secretWord)) {
            return match.index + match[0].length;
        }
        return 0;
    }

    const fortifyMetadataExtension = EditorState.transactionFilter.of((tr) => {
        if (!tr.docChanged) return tr;
        const metadataEnd = getMetadataEndPosition(tr.startState);
        if (metadataEnd === 0) return tr;

        let transactionBlocked = false;
        let modifiedChanges = [];

        tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
            if (fromA < metadataEnd) {
                if (toA > metadataEnd) {
                    modifiedChanges.push({ from: metadataEnd, to: toA, insert: inserted });
                } else {
                    transactionBlocked = true;
                }
            } else {
                modifiedChanges.push({ from: fromA, to: toA, insert: inserted });
            }
        });

        if (transactionBlocked && modifiedChanges.length === 0) return [];
        return { changes: modifiedChanges, selection: tr.selection };
    });

    // Populate global configuration extensions arrays
    editorExtensions = [
        highlightSpecialChars(),
        history(),
        drawSelection(),
        syntaxHighlighting(textStyling),
        markdown(),
        textHiderExtension,
        fortifyMetadataExtension,
        contentListener,
        keymap.of([...defaultKeymap, ...historyKeymap])
    ]

    let state = EditorState.create({
        doc: "<--! No file is opened -->",
        extensions: editorExtensions
    })

    // Instantiate your view container cleanly
    view = new EditorView({
        state: state,
        parent: codeMirrorContainer
    })
}