var myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');

export const GET = ()=>({
  method: "GET",
  headers: myHeaders,
  mode: "cors",
  cache: "default"
})

export const POST = (data)=>({
  method: "POST",
  headers: myHeaders,
  mode: "cors",
  cache: "default",
  body:data
})

export const UPDATE = (data)=>({
  method: "POST",
  headers: myHeaders,
  mode: "cors",
  cache: "default",
  body:data
})

export const DELETE = ()=>({
  method: "DELETE",
  headers: myHeaders,
  mode: "cors",
  cache: "default",
  body:data
})
