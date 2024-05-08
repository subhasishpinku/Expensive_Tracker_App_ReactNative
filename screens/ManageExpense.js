import { useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput} from 'react-native';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import Button from '../components/UI/Button';
import { ExpensesContext } from '../store/expenses-context';
import { useContext } from 'react';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import { storeExpense, updateExpense, deleteExpense } from '../util/http';
import firebase from 'firebase/app';
import 'firebase/auth';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';
function ManageExpense({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const expensesCtx = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;
  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense',
    });
  }, [navigation, isEditing]);

 async function deleteExpenseHandler() {
   setIsSubmitting(true);
   try{
    await deleteExpense(editedExpenseId);
    expensesCtx.deleteExpense(editedExpenseId);
    navigation.goBack();
   }catch (error){
    setError('Could not delete expenses - please try again later');
    setIsSubmitting(false);
   }
  
  }

  function cancelHandler() {
    navigation.goBack();
  }

 async function confirmHandler(expenseData) {
    setIsSubmitting(true);
    try{
      if (isEditing) {
        // expensesCtx.updateExpense(
        //   editedExpenseId,
        //   {
        //     description: 'Test!!!!',
        //     amount: 29.99,
        //     date: new Date('2022-05-20'),
        //   }
        // );
        expensesCtx.updateExpense(editedExpenseId,expenseData);
       await updateExpense(editedExpenseId,expenseData);
      } else {
        // expensesCtx.addExpense({
        //   description: 'Test',
        //   amount: 19.99,
        //   date: new Date('2022-05-19'),
        // });
         const id = await  storeExpense(expenseData)
         expensesCtx.addExpense({...expenseData, id: id});
  
      }
      navigation.goBack();
    }catch (error){
      setError('Could not save data - please try again later!');
      setIsSubmitting(false);
    }
  }
  function errorHandler() {
   setError(null);
  } 

  if(error && !isSubmitting){
    // return <ErrorOverlay message={error} onConfirm={errorHandler}/>
    return <ErrorOverlay message={error}/>

  }

  if(isSubmitting){
    return <LoadingOverlay/>
  }

  return (
    <View style={styles.container}>
      <ExpenseForm submitButtonLabel={isEditing ? 'Update' : 'Add'}
      onSubmit={confirmHandler}
      onCancel={cancelHandler}
      defaultValues={selectedExpense}/>
      
      {/* <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={cancelHandler}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={confirmHandler}>
          {isEditing ? 'Update' : 'Add'}
        </Button>
      </View> */}
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  // buttons: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // button: {
  //   minWidth: 120,
  //   marginHorizontal: 8,
  // },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
});