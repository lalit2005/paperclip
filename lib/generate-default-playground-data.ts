const generateDefaultPlaygroundData = (
  name: string,
  profilePicUrl: string,
  nickname: string
) => {
  const HTML = `
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">

<div class="text-center mt-5 px-5">
  <img src="${profilePicUrl}" width="100px" height="100px" alt="${name}" class="rounded-circle my-5">
    <h1>Hey there ${name}</h1>
    <p class="mt-3 text-muted">Here are some of the Shortcuts you can use here, in the playground ${name} 😍</p>
    <div class="mt-5">
        <table class="table table-striped table-dar border border-5 rounded-3">
         <thead>
            <tr>
                <td><strong>Shortcut</strong></td>
                <td><strong>What it does?</strong></td>
            </tr> 
         </thead>
            <tr>
                <td>Cmd/Ctrl + S</td>
                <td>Save code</td>
            </tr>
            <tr>
                <td>Cmd/Ctrl + 1</td>
                <td>Go to HTML tab</td>
            </tr>
            <tr>
                <td>Cmd/Ctrl + 2</td>
                <td>Go to CSS tab</td>
            </tr>
            <tr>
                <td>Cmd/Ctrl + 1</td>
                <td>Go to JS tab</td>
            </tr>
            <tr>
                <td>Cmd/Ctrl + 4</td>
                <td>Copy current tab's code</td>
            </tr>
            <tr>
                <td>F1</td>
                <td>Command pallete for loads of awesome stuff</td>
            </tr>
        </table>
    </div>
</div>
	`;

  const CSS = `
				table {
					border-collapse: separate !important;
			}

			table td {
					border: 1px solid lightgray;
			}

			table thead td {
					border: 2px solid transparent;
			}
			`;

  const JS = `
	const ${name}sData = {
    name: "${name}",
    nickname: "${nickname}",
    picture: "${profilePicUrl}"
}
	console.log(${name}sData)
	`;

  return {
    HTML,
    CSS,
    JS,
  };
};

export default generateDefaultPlaygroundData;
