import mongoose from "mongoose";
import 'dotenv/config'
const connectWithDb = (app) => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`DB got connected!`))
    .catch((err) => {
      console.log(`DB got issues`);
      console.log(err);
      process.exit(1);
    });
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port: ${process.env.PORT}`);
  });
};
export default connectWithDb