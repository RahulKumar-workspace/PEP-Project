import "./App.css"
import { Editor } from "@monaco-editor/react"
import { MonacoBinding } from "y-monaco" 
// MonacoBinding :-> to connect YJS with Monaco Editor
// then whatever changes we make in the editor will be broradcasted to the other users too with the help of server
  
import { useRef, useMemo, useState, useEffect } from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"

function App() {

  const editorRef = useRef(null)
  const [ username, setUsername ] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || ""
  })
  const [ users, setUsers ] = useState([]) // to show the users in a list format

  const ydoc = useMemo(() => new Y.Doc(), [])
  //ydoc -> kind of a data structur YJS uses to store everything(documentations, code) made at the frontend.
  //        can store data of multiple files in the form of key-value pairs.
  // YJS fir isi data ko check/compare krta h for changes and jo bhi Delta(result/changes) nikalta h usko vo server pr bhej deta h.
  // and then the server broadcasts the Delta to all the other users to reflect the chanegs made by one user.
  const yText = useMemo(() => ydoc.getText("monaco"), [ ydoc ]) // to get data from a single file


  const handleMount = (editor) => {
    editorRef.current = editor

    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([ editorRef.current ]),
    )
  }

  const handleJoin = (e) => {
    e.preventDefault()
    setUsername(e.target.username.value)
    window.history.pushState({}, "", "?username=" + e.target.username.value) // to save the state even if we reload the page.
  }

  useEffect(() => {

    console.log(username)

    if (username) {

      // SocketIOProvider -> TO build the connection between User and Server. V.IMP 
      const provider = new SocketIOProvider("/", "monaco", ydoc, {
        autoConnect: true,
      })


    // Awareness -> handels all the users like how many users are there, how many are gone, etc
      provider.awareness.setLocalStateField("user", { username })

      const states = Array.from(provider.awareness.getStates().values())

      console.log(states)

      setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values())
        setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))
      })

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null)
      }

      window.addEventListener("beforeunload", handleBeforeUnload)


      return () => {
        provider.disconnect()
        window.removeEventListener("beforeunload", handleBeforeUnload)
      }
    }
  }, [
    username
  ])

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center" >
        <form
          onSubmit={handleJoin}
          className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your username"
            className="p-2 rounded-lg bg-gray-800 text-white"
            name="username"
          />
          <button
            className="p-2 rounded-lg bg-amber-50 text-gray-950 font-bold"
          >
            Join
          </button>
        </form>
      </main>
    )
  }

  return (
    <main
      className="h-screen w-full bg-gray-950 flex gap-4 p-4"
    >
      <aside
        className="h-full w-1/4 bg-amber-100 rounded-lg "
      >
        <h2 className="text-2xl font-bold p-4 border-b border-gray-300">Users</h2>
        <ul className="p-4">
          {users.map((user, index) => (
            <li key={index} className="p-2 bg-gray-800 text-white rounded mb-2">
              {user.username}
            </li>
          ))}
        </ul>

      </aside>
      <section
        className="w-3/4 bg-neutral-800 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>

    </main>
  )
}

export default App
