// export async function getCards() {

//   const res = await fetch("http://127.0.0.1:8001/mapconfig/collections/")
//   const data = await res.json()

//   return data.map(item => ({
//     title: item.name.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase()),
//     value: item.name,
//     description: item.description || "",
//     image: `/carousel/${item.name}`,
//     layers: item.layers_data 
//   }))

// }


export async function getCards() {

  const res = await fetch("/carousel/data2.json")
  const data = await res.json()

  return data.map(item => ({
    title: (item.name || item.value).replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase()),
    value: item.name || item.value,
    description: item.description || "",
    image: item.image || `/carousel/${item.name || item.value}`,
    layers: item.layers_data || item.layers
  }))
}