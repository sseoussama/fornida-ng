const build_ids = [ {val:1},{val:2} ]

for (let id in build_ids) {
    console.log(build_ids[id]);
    getStash(build_ids[id], (build) => {
        console.log(build)
    });
}

function getStash(build, cb) {
    setTimeout(() => {
        cb(`proccessing ${build.val}`);
    }, 1000);
}