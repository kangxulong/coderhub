Promise.prototype.all = function (args) {
  let result = [];
		args.map((fn) => {
			fn().then(res => {
        result.push(res);
      return result;
      }).catch(err => {
        return error
        console.log(err);
      })
		});
};
const promise = new Promise((res,rej) => {
  console.log('');
});

const promise1 = new Promise((res,rej) =>{
  Promise.resolve
});
const promise2 = new Promise((res,rej) => {
  Promise.reject
});

promise.all(promise1,promise1);