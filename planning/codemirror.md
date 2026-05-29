# Making a extension for turning the doc into read only

things we need Class.Function of that class.facet.configuration of the facet

1. class EditorState
2. static readOnly: Facet<boolean, boolean>
3. of(value: Input) → Extension

Making of the function is using the class then calling the function of that class.
the docs shows what kind of value the function will accept in this case the value is a boolean.
Although there are two boolean written there <boolean, boolean> but you only pass one the, the second is a type script thing, the other
is the required type that will be put inside the facet as configuration.

Then for facet you will mostly be using the of facet which also shows what it does it will take an input and an optional arrow function
(Input) = { your funcction }

## Assembling the read only extenion

*const readOnly = EditorState.readOnly.of(true)*

## Steps to make more custom things

1. Make a class
2. make a function
3. make a state field
4. pull out your hair and smash your pc

# State Fields

<Note this is mostly copied stuff from a blog post>

When you want to keep stateful data you will be using state fields, for example counting the words or characters as user is typing.
When the editor updates the state field get to recompute the data

To use state fields for counting changes you will be needing

1. **StateField** Class
2. Static define class *static define<Value>(config: Object) → StateField<Value>*
3. create config to get the current value and return intial value *create(state: EditorState) → Value*
4. update config to compute the new value *update(value: Value, transaction: Transaction) → Value*

- The define class needs a value the value will be defining the type of data in our case it will be <number>

const countWordsStateField = StateField.define<number>({...}) 

- next we need to pass in the create config, for the intial value we can pass 0 with a arrow function, the create config has a 
- arugument for the state of the editor so we will be using **state**

const countChangesStateField = StateField.define<number>({
    create: (state) => {
        return 0;
    },
}) 

- now we will be adding the update config to calculate the value, update will have two arguments, 
- value (the current value of the **state field**)
- transaction (current changes to the **editor state**)

const countWordsStateField = StateField.define<number>({
    create: (state) => {
        return 0;
    },
    update: (value, transaction) => {
        let newValue = value; // putting the value in a let so we can update it 

        if(transaction.docChanged) { // .docChanged is a config that send a boolean if the editor state changed
            newValue+= 1
        } 
    
        return newValue;
    }
}) 


now this simple function should update the counter, but if I want some other extention to do changes or update the stateFiled I need to 
use **StateEffect**

For StateEffect we need

1. StateEffect *StateEffect<Value>*
2. static define class *static define<Value = null>(spec⁠?: Object = {}) → StateEffectType<Value>*

const updateCounterStateEffect = StateEffect<number>.define()

Now this is not actually a stateEffect but a instance of a StateEffectType // The blog I am reading for understading seems to be written by AI

StateEffectType seems to be some kind of descriptor of the value?

## NOW we are making a stateEffect?

const **updateCounterStateEffectType** = StateEffect<number>.define();
const **incrimentCounterByFive** = updateCounterStateEffectType.*of*(5)

So we got a counter updater now? //I have no idea anymore

And now we are going to *Dispatch* the state effect

For that we are going to upadte the previous stateField

const countWordsStateField = StateField.define<number>({
    create: (state) => {
        return 0;
    },
    update: (value, transaction) => {
        let newValue = value; // putting the value in a let so we can update it 

        if(transaction.docChanged) { // .docChanged is a config that send a boolean if the editor state changed
            newValue+= 1
        } 

>       for (const effect of transaction.effects){
>           if(effect.is(updateCounterStateEffectType)) {
>               newValue += effect.value;
>           }
>       }
    
        return newValue;
    }
}) 

Each transaction contains an array of effects it seems, and we can loop through them.
When effect.is() call return true the effect.value is inffered as number 

We can use stateField's provide argument it seems *provide⁠?: fn(plugin: ViewPlugin<V, any>) → Extension*
this argument returns an extention, that will recieves the value from the statefield and renders that value in a panel
- Panels are part of CodeMirror, and thay can be toggled, for them we need a stateField and effect
1. PanelConstructor *type PanelConstructor = fn(view: EditorView) → Panel*

functin createCounterPanel(value): PanelConstructor { // So this is actully the patter of making panels
    return () => {
        const dom = document.createElement("div");
        dom.textContent = value
        return {dom}
    }
}

Now we will be updating the code with the panels

const countWordsStateField = StateField.define<number>({
    create: (state) => {
        return 0;
    },
    update: (value, transaction) => {
        let newValue = value; // putting the value in a let so we can update it 

        if(transaction.docChanged) { // .docChanged is a config that send a boolean if the editor state changed
            newValue+= 1
        } 

        for (const effect of transaction.effects){
            if(effect.is(updateCounterStateEffectType)) {
               newValue += effect.value;
            }
        }
        return newValue;
    },
>    provide: (value) => showPanel.from(value, createCounterPanel), //showPanel.from, .from is a facet 
>   //*from<T extends Input>(field: StateField<T>) → Extension* takes *input* returns a  or basically anything TBH
});

**From the docs**
*class Facet<Input, Output = readonly Input[]> implements FacetReader<Output>*
A facet is a labeled value that is associated with an editor state. 
It takes inputs from any number of extensions, and combines those into a single output value.
Examples of uses of facets are the *tab size*, *editor attributes*, and *update listeners*.
Note that *Facet* instances can be used anywhere where *FacetReader* is expected.


# Had GEMINI sanitize the code

import { showPanel } from "@codemirror/view";

// 1. The Panel Builder (CodeMirror expects an object containing a 'dom' property)
function createCounterPanel(view) {
  const dom = document.createElement("div");
  dom.className = "cm-counter-panel";
  dom.textContent = "Changes: 0";
  
  return {
    dom,
    // CodeMirror automatically fires this 'update' whenever the editor changes!
    update(viewUpdate) {
      // Pull the current numeric value straight out of our StateField database
      const currentCount = viewUpdate.state.field(countWordsStateField);
      dom.textContent = "Changes: " + currentCount;
    }
  };
}

// 2. The Unified StateField
const countWordsStateField = StateField.define({
  create: (state) => 0,
  
  update: (value, transaction) => {
    let newValue = value;
    if (transaction.docChanged) newValue += 1;

    for (const effect of transaction.effects) {
      if (effect.is(updateCounterStateEffectType)) {
        newValue += effect.value;
      }
    }
    return newValue;
  },

  // FIX HERE: Pass the field to showPanel.from, then return your panel builder function
  provide: (field) => showPanel.from(field, (isActive) => createCounterPanel)
});