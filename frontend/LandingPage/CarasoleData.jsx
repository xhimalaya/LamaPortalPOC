export async function getCards() {

  const res = await fetch("http://127.0.0.1:8001/mapconfig/collections/")
  const data = await res.json()

  return data.map(item => ({
    title: item.name.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase()),
    value: item.name,
    description: item.description || "",
    image: `/carousel/${item.name}.jpeg`,
    layers: item.layers_data 
  }))

}