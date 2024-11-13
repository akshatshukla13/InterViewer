import React, { useMemo, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import VideoCallWindow from './VideoCallWindow';
import '../stylings/RoomPage.css';

function RoomPage() {
    const { roomId } = useParams();
    const [id, setId] = useState("no");
    const [content, setContent] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [editorWidth, setEditorWidth] = useState("50vw"); // Start with 50% width
    const resizerRef = useRef(null);

    // Establish a socket connection
    const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL), []);

    useEffect(() => {
        socket.emit('join-room', roomId);

        socket.on("connect", () => {
            console.log("connected", socket.id);
            setId(socket.id);
        });

        socket.on("editorContentUpdate", (newContent) => setContent(newContent));
        socket.on("languageChange", (newLanguage) => setLanguage(newLanguage));

        return () => {
            socket.disconnect();
        };
    }, [socket, roomId]);

    const handleEditorChange = (newContent) => {
        setContent(newContent || "");
        socket.emit("editorContentUpdate", { newContent, roomId });
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        socket.emit("languageChange", newLanguage);
    };

    const editorDidMount = (editor, monaco) => {
        monaco.languages.registerCompletionItemProvider('javascript', {
            provideCompletionItems: () => ({
                suggestions: [
                    { label: 'console.log', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'console.log(${1:object});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Log output to console' },
                    { label: 'function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Function declaration' },
                    { label: 'if', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if (${1:condition}) {\n\t${2:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'If statement' },
                    { label: 'for loop', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For loop' },
                    { label: 'async function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'async function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Async function declaration' },
                ],
            }),
        });
    };

    // Handle resizing with mouse
    const handleMouseDown = (e) => {
        e.preventDefault();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const newWidth = e.clientX;
        setEditorWidth(`${newWidth}px`);
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className="room-page">
            <header className="header">
                <h1>Room: {roomId}</h1>
                <select className="editor-settings" onChange={handleLanguageChange} value={language}>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                </select>
                <span>Connected as ID: {id}</span>
            </header>
            <div className="editor-container">
                <div className="resizable-editor" style={{ width: editorWidth }}>
                    <Editor
                        height="100%"
                        language={language}
                        theme="vs-dark"
                        value={content}
                        onChange={handleEditorChange}
                        onMount={editorDidMount}
                    />
                </div>
                <div
                    ref={resizerRef}
                    className="resizer"
                    onMouseDown={handleMouseDown}
                />
            </div>
            <VideoCallWindow />
        </div>
    );
}

export default RoomPage;
