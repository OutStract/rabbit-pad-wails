
    // transaction filter acts as a middle man between the state and the view
    // The transaction is descibed as tr
    const secureMetadataExtension = EditorState.transactionFilter.of((tr) => { 
        
        if (!tr.docChanged) return tr; // No change? then return the transaction as is

        // This is passing the start of the user made change or transaction 
        // And gets the end positinon of the metadata saving that position in metadataEnd
        // Seems like this function is computing the firs loading transaction
        // Like when user opens a file
        const metadataEnd = getMetadataEndPosition(tr.startState);
        if (metadataEnd === 0) return tr; // If the transactoin starts at 0 then return

        let changes = [];
        let transactionBlocked = false;

        // This function will iterate over the transaction changes 
        // fromA, toA is the original range of the transaction
        tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
            // Okay so this is doing two checks to make sure that user pressed selected the metadata in the transactions and then pressed delete
            // First Check fromA: is the user attempted change starts at 0 
            // Second Check toA: Does the last position of the attemped change position is greater or equal to the metadata
            // This means if the document has 10 words with character range of 0 to 100 and metadata is the first word 0 to 20
            // So if the user selectes the whoel document or a big part of it like from 0 to 50
            // We are assuming they are trying to delete the metadata
            // first check if to get starting and if the starting is 0 then we go to the second check
            // in the example the user selected range 0 to 50 and the metadata is in  range 0 to 20
            // so 50 is greater then 20 means the metadata is inside the attempted transaction
            if (fromA === 0 && toA > metadataEnd) {

                    // So here we are putting the transactions changes in to a new array
                        changes.push({
                    from: metadataEnd, // from the metadata end 
                    to: toA, // To where ever the cursor transaction ends
                    insert: inserted // Keeps whatever they were trying to paste/type if applicable
                })
                // So here we are checking if the user is trying to be sneaky and mess from inside the metadata
                // Check one: If the user transaction starts at a posintion that is less then the ending
                // of the metadata like 10 while metadat ends at 20, means they are inside the transaction
                // Second check: does the transaction ends at a number bigger then 0, like 15
                // so if the metadata is in 0 to 20, and user is trying to delete 10 to 15 then it will be blocked
            } else if (fromA < metadataEnd && toA > 0) {
                transactionBlocked = true;

                // If the transaction is not trying to mess with metadata then let them pass
            } else {
                changes.push({ from: fromA, to: toA, insert: inserted });
            }
        });

        // This will cancel the function, and returns an empty array
        if (transactionBlocked) {
        return [];
        }

        // Now if things are clear we will return the changes in the applicable specs that transactionFilter retuns in
        // first are the changes which we made in and put in the empty array 
        // second are selections which we did not touch so we can pass it as is

        return {
            changes: changes,
            selection: tr.selection // Keep their intended cursor/selection target safe
        };
    });