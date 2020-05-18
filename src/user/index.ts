localStorage.setItem('username', 'test')
localStorage.setItem('userdata', '{"test": {"level": 1, "current": 1, "money": "1000", "time": 1588664255188, "card": [], "prop": []}}')

const user: anyObject = {
  active: '',
  data: {}
}
try {
  user.active = localStorage.getItem('username') || ''
  user.data = JSON.parse(localStorage.getItem('userdata') || '') || user.data
} catch (e) {}
export default user