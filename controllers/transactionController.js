export const getTransaction = async (req, res) => {
  try {
    const transaction = {
        id: 1,
        amount: 100,
        status: "success",
        date: new Date(),
        type: "credit",
        description: "Payment for services"
        
    };
    res.status(200).json({ transaction });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}