function testSelectValue(name){
  const el = document.querySelector(`select[name="${name}"]`)
  alert(el.value)
  return
}
