import Response from "../entities/Response.js";
export const getTransaction = async (req, res) => {
  try {
    const transaction = {
      id: 1,
      amount: 100,
      status: "success",
      date: new Date(),
      type: "credit",
      description: "Payment for services",
    };
    res
      .status(200)
      .json(new Response(200, "Transaction fetched successfully", transaction));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new Response(error.status || 500, error.message, null));
  }
};
