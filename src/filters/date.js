export default (value)=>{
  const date = new Date(value)
  return date.toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}