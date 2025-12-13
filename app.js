import express from 'express'
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';
const app = express();
// this middleware is used for parsing json request bodies
app.use(express.json());
// this middleware is used for parsing urlencoded request bodies
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(arcjetMiddleware)

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscription', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware)

app.get('/', (req, res)=>{
res.send('welcome to the subscription tracer api!');
});

app.listen(PORT, async()=>{
    console.log(`subscription tracer api work on http://localhost:${PORT}`);
    await connectToDatabase()
});
// Start after DB connection to ensure readiness (better for Render)
// const start = async () => {
//   try {
//     await connectToDatabase();
//     app.listen(PORT, () => {
//       console.log(`subscription tracer api work on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error('Failed to start application:', err);
//     process.exit(1);
//   }
// };

// if (process.env.NODE_ENV !== 'test') {
//   start();
// }
export default app;