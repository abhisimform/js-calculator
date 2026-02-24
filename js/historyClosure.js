export default function historyClosure() {
  let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

  const add = (entry) => {
    history.unshift(entry);

    if (history.length > 20) {
      history.pop();
    }
    
    save();
  }

  const save = () => {
    localStorage.setItem("calcHistory", JSON.stringify(history));
  }

  const getAllHistory = () => {
    return [...history];
  }

  const clear = () => {
    localStorage.removeItem('calcHistory');
  }

  return { add, save, getAllHistory, clear }
}