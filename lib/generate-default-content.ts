import { customAlphabet } from 'nanoid';

const generateDefaultContent = (name: string, email: string) => {
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = (len) => customAlphabet(alphabet, len);
  const whiteboardUrl = `https://excalidraw.com/#room=${nanoid(20)()},${nanoid(
    22
  )()}`;

  return `<p>Hey there <strong>${name}</strong></p>
<p>
  This is a short <mark>personalized guide</mark> to show what's possible 🤯 You
  can just erase everything by pressing Cmd/Ctrl + A and
  \`delete\`/\`backspace\`.
  <strong
    >But if you want to know what's possible along with some interesting
    features just go read it and then erase 😜</strong
  >
</p>
<p>
  If you are a dev ${name}, you must know WYSIWYG editor that supports markdown!
</p>
<hr />
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<p>
  You might like to
  <strong>bolden some important important text by pressing Cmd/Ctrl + B</strong
  >, while <mark>highlighting import text is also possible</mark><br />These are
  <code>inline code</code> which can by done by wrapping text in bacticks (\`) →
  \`lask\` (If you know this you must be a dev 🤔)
</p>
<p>Code blocks has code highlighting too!!!</p>
<pre><code class="language-javascript">console.log('Hope you are doing well ${name} 👋🏻'); // see all the langs here ---&gt;</code></pre>
<p>
  And you can just <strong>divide your note into parts</strong> by typing ---
  (that's 3 hyphens) in a new line
</p>
<hr />
<blockquote>
  <p>
    Just add a quote from a famous person here (that's how you prove your note
    aligns with a great one's mind 😜)
  </p>
</blockquote>
<p>And I'm sure ${name} must have known that lists are supported too 👇</p>
<ul>
  <li><p>Clean ${email}'s inbox</p></li>
  <li><p>Take a deep breath</p></li>
</ul>
<ol>
  <li><p>I don't know what else should be in this...</p></li>
  <li>
    <p><strong>...ordered list</strong> 😅</p>
  </li>
</ol>
<hr />
<p>
  And wait ${name}, you should not miss this → The most powerful feature of
  Paperclip is <strong><mark>EMBEDS</mark></strong> 👇
</p>
<p>
  Embed whichever website pops into your mind. If it's a popular one like
  <em>YouTube</em>, <em>Twitter</em>, <em>CodePen</em>, <em>Typeform</em>, etc..
  you can just paste in the link that you find in the top of the browser and we
  take care of the rest as shown below😎
</p>
<div class="iframe-wrapper">
  <iframe
    src="https://twitframe.com/show?url=https://twitter.com/rauchg/status/1425514507468562435"
    frameborder="0"
    allowfullscreen="true"
  ></iframe>
</div>
<p>
  <a
    target="_blank"
    rel="noopener noreferrer nofollow"
    href="https://twitter.com/rauchg/status/1425514507468562435"
    >https://twitter.com/rauchg/status/1425514507468562435</a
  >
  👆
</p>
<hr />
<div class="iframe-wrapper">
  <iframe
    src="https://www.youtube-nocookie.com/embed/cuHDQhDhvPE"
    frameborder="0"
    allowfullscreen="true"
  ></iframe>
</div>
<p>
  <a
    target="_blank"
    rel="noopener noreferrer nofollow"
    href="https://www.youtube.com/watch?v=cuHDQhDhvPE"
    >https://www.youtube.com/watch?v=cuHDQhDhvPE</a
  >
  👆
</p>
<p>DON'T watch that now ${name}!! You might end up not writing down notes 😂</p>
<hr />
<p>And if you are an MS Excel lover, I hope this mini table can suffice you</p>
<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="1"><p>Roll No.</p></th>
      <th colspan="1" rowspan="1"><p>Name</p></th>
      <th colspan="1" rowspan="1"><p>Is awesome</p></th>
    </tr>
    <tr>
      <td colspan="1" rowspan="1" style="background-color: null"><p>1.</p></td>
      <td colspan="1" rowspan="1" style="background-color: null">
        <p>${name}</p>
      </td>
      <td colspan="1" rowspan="1" style="background-color: null"><p>Yes</p></td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1" style="background-color: null"><p>2.</p></td>
      <td colspan="1" rowspan="1" style="background-color: null">
        <p>Lalit</p>
      </td>
      <td colspan="1" rowspan="1" style="background-color: null"><p>Yes</p></td>
    </tr>
  </tbody>
</table>
<hr />
<p>
  And ${name} if you are a visual person who needs whiteboard to brainstorm your
  ideas along with your notes, you can do it too!! (just click on the button
  that says <code>Add whiteboard to notes</code> in the toolbar)👇
</p>
<div class="iframe-wrapper">
  <iframe
    src="${whiteboardUrl}"
    frameborder="0"
    allowfullscreen="true"
  ></iframe>
</div>
<p>Hope you are done playing around with the whiteboard ${name}.</p>
<p>
  If you have read till this, I really appreciate it 😌. Lemme just finish this
  off with a <strong>pro-tip for whiteboard</strong>
</p>
<blockquote>
  <p>
    <mark>PRO TIP 💡</mark>: Press <code>Alt/Option + Z</code> inside embedded
    whiteboard for <strong>Zen Mode </strong>and <code>Alt/Option + R</code> for
    <strong>View Mode</strong>. For more Keyboard shortcuts in embedded
    whiteboard click on <code>?</code> icon in bottom.
  </p>
</blockquote>
<p>
  And last but not least,
  <strong>You can make your note public into a website!!!</strong> Click on the
  more options here ➜
</p>
`;
};

export default generateDefaultContent;
