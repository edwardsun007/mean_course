var nums1 = [ 'coding', 'fun'];

var stuff = ['cat', 'dog'];
spreadOps=( nums1, stuff) => {
  return { ...nums1,stuff};
}

console.log(spreadOps(nums1, stuff));

console.log('foo');

setTimeout( ()=>console.log('bar'),1000);

console.log('war');

