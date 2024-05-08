import axios from 'axios';
const BACKEND_URL = 'https://react-native-course-353be-default-rtdb.firebaseio.com/'
export async function storeExpense(expenseData) {
  try {
    const response = await axios.post(
        BACKEND_URL + '/expenses.json',
      expenseData
    );
    const id = response.data.name;
    return id;
    // console.log('Expense stored successfully:', response.data);
    // return response.data; // Return the response data if needed
  } catch (error) {
    console.error('Error storing expense:', error);
    throw error; // Rethrow the error to handle it further up the call stack
  }
}


export async function fetchExpenses() {
    try {
      const response = await axios.get(
        BACKEND_URL + '/expenses.json'
      );
      const expenses = [];
      for(const key in response.data){
        const expenseObj = {
          id: key,
          amount: response.data[key].amount,
          date: new Date(response.data[key].date),
          description: response.data[key].description
        };
        expenses.push(expenseObj);
      }
      console.log('Expense Fetch successfully:', response.data);
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error('Error storing expense:', error);
      throw error; // Rethrow the error to handle it further up the call stack
    }
  }

  export function updateExpense(id, expenseData) {
    return axios.put(BACKEND_URL + `/expenses/${id}.json`, expenseData);
  }
  
  export function deleteExpense(id) {
    return axios.delete(BACKEND_URL + `/expenses/${id}.json`);
  }