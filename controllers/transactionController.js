import Response from "../entities/Response.js";
export const getTransaction = async (req, res) => {
  try {
    const transactions = {
        id: 1,
        amount: 100,
        status: "success",
        date: new Date(),
        type: "credit",
        description: "Payment for services"
        
    };
    new Response(200, "Fetched all transactions", { transactions }).success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);

  }
};
