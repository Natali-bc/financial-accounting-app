const getDataIncomes = (state) => state.operations.monthIncoms;
const getDataCosts = (state) => state.operations.monthCosts;
const balance = (state) => state.auth.user.balance;

// eslint-disable-next-line import/no-anonymous-default-export
export default { balance, getDataIncomes, getDataCosts };
