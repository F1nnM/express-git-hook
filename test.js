const { multihook, hook } = require('./index.js');

const functionToTest1 = hook("https://github.com/F1nnM/express-git-hook", "./test")

req1 = {
    body: JSON.stringify({
        repository: {
            url: "https://github.com/F1nnM/express-git-hook"
        }
    })
};

res1 = {locals:{}};

functionToTest1(req1, res1).then(() => {
    console.log(JSON.stringify(res1.locals.files))
})

const functionToTest2 = multihook({"https://github.com/F1nnM/express-git-hook": "./test2"})

req2 = {
    body: JSON.stringify({
        repository: {
            url: "https://github.com/F1nnM/express-git-hook"
        }
    })
};

res2 = {locals:{}};

functionToTest2(req2, res2).then(() => {
    console.log(JSON.stringify(res2.locals.files))
})