const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { code, language, stdin } = req.body;
    if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required" });
    }
    console.log("this is code: ", code);
    console.log("this is codestringified: ", JSON.stringify(code));

    const filePaths = {
        'c': path.join(__dirname, 'Main.c'),
        'python': path.join(__dirname, 'Main.py'),
        'java': path.join(__dirname, 'Main.java'),
        'cpp': path.join(__dirname, 'Main.cpp'),
        'javascript': path.join(__dirname, 'Main.js')
    };

    const filePath = filePaths[language.toLowerCase()];
    if (!filePath) {
        return res.status(400).json({ error: "Unsupported language" });
    }

    try {
        fs.writeFileSync(filePath, code);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to write file" });
    }

    const commands = {
        'c': ['sh', '-c', `gcc ${filePath} -o a.out && ./a.out`],
        'python': ['python3', filePath],
        'java': ['sh', '-c', `javac ${filePath} && java -cp ${path.dirname(filePath)} Main`],
        'cpp': ['sh', '-c', `g++ ${filePath} -o ${filePath}.out && ${filePath}.out`],
        'javascript': ['node', filePath]
    };



    const commandArgs = commands[language.toLowerCase()];
    if (!commandArgs) {
        return res.status(400).json({ error: "Unsupported language" });
    }
    console.log(stdin); // this is the input
    console.log(code); // this is the code
    async function executeCode(commandArgs, stdin) {
        const command = commandArgs[0];
        const args = commandArgs.slice(1);

        return new Promise((resolve, reject) => {
            const process = spawn(command, args);

            let output = '';
            let error = '';

            // Write the stdin content to the process
            if (stdin) {
                process.stdin.write(stdin + "\n");
            }
            process.stdin.end();

            // Capture stdout
            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            // Capture stderr
            process.stderr.on('data', (data) => {
                error += data.toString();
            });

            // Process exit handler
            process.on('close', (code) => {
                if (code === 0) {
                    resolve(output);
                } else {
                    reject(error || `Process exited with code ${code}`);
                }
            });
        });
    }

    return executeCode(commandArgs, stdin)
        .then((output) => {
            console.log(output);
            return res.status(200).json({ output });
        })
        .catch((error) => {
            console.log(error)
            return res.status(500).json({ error });
        });
}
