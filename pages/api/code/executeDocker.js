const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const containerName = {
    'c': 'c_container',
    'python': 'python_container',
    'java': 'java_container',
    'cpp': 'cpp_container',
    'javascript': 'js_container',
    'ruby': 'ruby_container',
    'go': 'go_container',
    'swift': 'swift_container',
    'php': 'php_container',
    'bash': 'bash_container',
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { code, language, stdin } = req.body;
    if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required" });
    }
    console.log("this is code: ", code);
    console.log("stdin: ", stdin);
    console.log("this is codestringified: ", JSON.stringify(code));

    const filePaths = {
        'c': path.join('docker/c', 'Main.c'),
        'python': path.join('docker/python', 'Main.py'),
        'java': path.join('docker/java', 'Main.java'),
        'cpp': path.join('docker/cpp', 'Main.cpp'),
        'javascript': path.join('docker/js', 'Main.js'),
        'ruby': path.join('docker/ruby', 'Main.rb'),
        'go': path.join('docker/go', 'Main.go'),
        'swift': path.join('docker/swift', 'Main.swift'),
        'php': path.join('docker/php', 'Main.php'),
        'bash': path.join('docker/bash', 'Main.sh'),
    };

    const filePath = filePaths[language.toLowerCase()];
    if (!filePath) {
        console.log("error: ", "Unsupported language");
        return res.status(401).json({ error: "Unsupported language" });
    }

    try {
        fs.writeFileSync(filePath, code);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to write file" });
    }
    console.log(path.resolve('docker/python'));
    const dockerCommands = {
        'python': [
            'timeout', '6', 'docker', 'run', '--rm', '-i', '--stop-timeout', '1', '--name', 'python_container',
            '-v', `${path.resolve('docker/python')}:/app`,
            'python:3.9-slim', 'python', '/app/Main.py'
        ],
        'java': [
            'timeout', '6', 'docker', 'run', '--rm', '-i', '--stop-timeout', '1', '--name', 'java_container',
            '-v', `${path.resolve('docker/java')}:/app`,
            'openjdk:11-jdk-slim', 'sh', '-c', 'javac /app/Main.java && java -cp /app Main'
        ],
        'javascript': [
            'timeout', '6', 'docker', 'run', '--rm', '-i', '--stop-timeout', '1', '--name', 'js_container',
            '-v', `${path.resolve('docker/js')}:/app`,
            'node:22-slim', 'node', '/app/Main.js'
        ],
        'c': [
            'timeout', '6', 'docker', 'run', '--rm', '-i', '--stop-timeout', '1', '--name', 'c_container',
            '-v', `${path.resolve('docker/c')}:/app`,
            'gcc:latest', 'sh', '-c', 'gcc /app/Main.c -o /app/a.out && /app/a.out'
        ],
        'cpp': [
            'timeout', '6', 'docker', 'run', '--rm', '-i', '--stop-timeout', '1', '--name', 'cpp_container',
            '-v', `${path.resolve('docker/cpp')}:/app`,
            'gcc:latest', 'sh', '-c', 'g++ /app/Main.cpp -o /app/a.out && /app/a.out'
        ],
        'ruby': [
            'timeout', '6', 'docker', 'run', '--rm', '-i', '--stop-timeout', '1', '--name', 'ruby_container',
            '-v', `${path.resolve('docker/ruby')}:/app`,
            'ruby:latest', 'ruby', '/app/Main.rb'
        ],
        'go': [
            'timeout', '6', 'docker', 'run', '--rm', '-i', '--stop-timeout', '1', '--name', 'go_container',
            '-v', `${path.resolve('docker/go')}:/app`,
            'golang:1.20', 'sh', '-c', 'go run /app/Main.go'
        ],
        'swift': [
            'timeout', '6', 'docker', 'run', '--rm', '-i', '--stop-timeout', '1', '--name', 'swift_container',
            '-v', `${path.resolve('docker/swift')}:/app`,
            'swift:latest', 'swift', '/app/Main.swift'
        ],
        'php': [
            'timeout', '6', 'docker', 'run', '--rm', '-i', '--stop-timeout', '1', '--name', 'php_container',
            '-v', `${path.resolve('docker/php')}:/app`,
            'php:8.1', 'php', '/app/Main.php'
        ],

        'bash': [
            'timeout', '6', 'docker', 'run', '--rm', '-i', '--stop-timeout', '1', '--name', 'bash_container',
            '-v', `${path.resolve('docker/bash')}:/app`,
            'bash:latest', 'bash', '/app/Main.sh'
        ]
    }


    const commandArgs = dockerCommands[language.toLowerCase()];
    if (!commandArgs) {
        console.log("error: ", "Unsupported language");

        return res.status(401).json({ error: "Unsupported language" });
    }
    setTimeout(() => {
        const stopAllContainers = spawn('docker', ['stop', containerName[language]], { shell: true });

        stopAllContainers.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        stopAllContainers.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        stopAllContainers.on('close', (code) => {
            if (code !== 0) {
                console.error(`docker stop process exited with code ${code}`);
            } else {
                console.log('All containers stopped successfully');
            }
        });
    }, 6000);

    async function executeCode(commandArgs, stdin) {
        const command = commandArgs[0];
        const args = commandArgs.slice(1);

        return new Promise((resolve, reject) => {
            const process = spawn(command, args);

            let output = '';
            let error = '';

            // Write the stdin content to the process
            if (stdin) {
                console.log("stdin: ", stdin);
                process.stdin.
                    write(stdin + "\n");
            }
            process.stdin.end();

            // Capture stdout
            process.stdout.on('data', (data) => {
                console.log("data: ", data);
                output += data.toString();
            });

            // Capture stderr

            process.stderr.on('data', (data) => {
                console.log("error: ", data);
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
            console.log(error);
            if (error.includes("Process exited with code")) {
                error = "timeout error";
            }
            return res.status(300).json({ error });
        });

    /*
        const commands = {
            'c': ['sh', '-c', `gcc ${filePath} -o a.out && ./a.out`],
            'python': ['python3', filePath],
            'java': ['sh', '-c', `javac ${filePath} && java -cp ${path.dirname(filePath)} Main`],
            'cpp': ['sh', '-c', `g++ ${filePath} -o ${filePath}.out && ${filePath}.out`],
            'javascript': ['node', filePath]
        };*/



    /*
    
    
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
    
    */
}