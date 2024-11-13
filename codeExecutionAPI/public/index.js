require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' } });

require(['vs/editor/editor.main'], function () {
    // Initialize Monaco Editor
    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: '// Write your code here...',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
    });

    // Language Selector Handler
    document.getElementById('language-select').addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        monaco.editor.setModelLanguage(editor.getModel(), selectedLanguage);
    });

    // Execute code
    window.executeCode = async function() {
        const code = editor.getValue();
        const outputElement = document.getElementById("output");
        
        // Get the selected language from the dropdown
        const language = document.getElementById("language-select").value;

        // Display "Executing code..." message
        outputElement.textContent = "Executing code...";

        try {
            // Send POST request to the backend
            const response = await fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language })
            });

            // Parse the response
            const data = await response.json();

            if (response.ok) {
                // Display the output or error in the output box
                outputElement.textContent = data.output || "Execution completed without output.";
            } else {
                // Display error message
                outputElement.textContent = "Error: " + (data.error || "Execution failed.");
            }
        } catch (error) {
            // Handle any network errors
            outputElement.textContent = "Network error: " + error.message;
        }
    };

    // Add JavaScript code completion snippets (Optional)
    monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: () => ({
            suggestions: [
                {
                    label: 'console.log',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'console.log(${1:object});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Log output to console'
                },
                {
                    label: 'function',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Function declaration'
                },
                {
                    label: 'if',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'if (${1:condition}) {\n\t${2:// body}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If statement'
                },
                {
                    label: 'for loop',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:// body}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'For loop'
                }
            ]
        })
    });
});
