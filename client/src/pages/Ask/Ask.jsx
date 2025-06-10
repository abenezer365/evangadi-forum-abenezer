import React, { useRef } from 'react'
import css from './Ask.module.css'
import axios from '../../../utils/axios'
function Ask() {
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const tagRef = useRef(null)
   const token = localStorage.getItem('token')
  async function postQuestion(e) {
    e.preventDefault()
    try {
     const res = await axios.post('/question/',{
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        tag: tagRef.current.value},{
           headers: { Authorization: `Bearer ${token}`}
        })
        titleRef.current.value = ''
        descriptionRef.current.value = ''
        tagRef.current.value = ''
        alert(res.data.message)
    } catch (error) {
      console.log(error)
      alert(error.response.data.message || error.message || 'Unable to post the question, my bad!😒')
    }
  }
  return (
    <div className={css.ask}>
     <div className={css.steps}>
      <h1>Steps to write a good question</h1>
      <ul>
        <li>Summarize your problem in a one-line title.</li>
        <li>Describe your problem in more detail.</li>
        <li>Describe what you tried and what you expected to happen.</li>
        <li>Review your question and post it to the site.</li>
      </ul>
     </div>
     <div className={css.formbox}>
      <h1>Ask a public question</h1>
      <form >
        <p>Title</p>
        <input ref={titleRef} required className={css.titlearea} type="text" placeholder='What is Java Script?'/>
        <p>Tag</p>
        <select ref={tagRef} className={css.selectbox} name="tag">
          <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="c++">C++</option>
                <option value="php">PHP</option>
                <option value="go">Go (Golang)</option>
                <option value="typescript">TypeScript</option>
                <option value="ruby">Ruby</option>
                <option value="swift">Swift</option>

                <option value="react">React</option>
                <option value="vue">Vue.js</option>
                <option value="nodejs">Node.js</option>
                <option value="express">Express.js</option>
                <option value="nextjs">Next.js</option>
                <option value="django">Django</option>
                <option value="laravel">Laravel</option>
                <option value="mongodb">MongoDB</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="devops">DevOps</option>

        </select>
        <p>Description</p>
        <textarea  ref={descriptionRef} required className={css.textarea} placeholder='What is a loop? Can you name one type of loop in JavaScript?, How can you check the type of a variable in JavaScript?' />
        <button className={css.signout} onClick={postQuestion}>Post Question</button>
     </form>
     </div>
    </div>
  )
}

export default Ask
