import React, { useMemo, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Rnd } from 'react-rnd';

function RoomPage() {
    const { roomId } = useParams();
    const [id, setId] = useState("no");
    const [content, setContent] = useState("");
    const [language, setLanguage] = useState("javascript");

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

    // Function to initialize video call with ZegoUIKitPrebuilt
    const myMeeting = async (element) => {
        const appId = Number(import.meta.env.VITE_APP_ID);
        const serverSecret = import.meta.env.VITE_SERVER_SECRET;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appId,
            serverSecret,
            roomId,
            Date.now().toString(),
            "UserName123"
        );
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: element,
            scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
        });
    };

    return (
        <div className="room-page">
            <h1>Room ID: {roomId}</h1>
            <div style={{ marginBottom: "10px" }}>
                <select onChange={handleLanguageChange} value={language} style={{ marginRight: "10px" }}>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                </select>
            </div>
            <Editor
                height="300px"
                width="100%"
                language={language}
                theme="vs-dark"
                value={content}
                onChange={handleEditorChange}
                onMount={editorDidMount}
            />
            <Rnd
                default={{ x: 100, y: 100, width: 600, height: 400 }}
                minWidth={300}
                minHeight={200}
                bounds="window"
                className="drag-resize-container"
            >
                <div
                    ref={myMeeting}
                    style={{ width: "100%", height: "100%", backgroundColor: "#f0f0f0" }}
                />
            </Rnd>
        </div>
    );
}

export default RoomPage;
