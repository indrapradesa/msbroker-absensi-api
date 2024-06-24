import dotenv from 'dotenv';
dotenv.config();

const config = {
    conn: {
        host: process.env.DB_DASARATA_HOST,
        user: process.env.DB_DASARATA_USER,
        password: process.env.DB_DASARATA_PASS,
        db_dasarata_hr: process.env.DB_DASARATA_HR,
    },
    rabbitMQ : {
        url: process.env.RABBITMQ_URL,
        exchangeName: process.env.RABBITMQ_EXCHANGE_NAME,
        queueName : process.env.RABBITMQ_QUEUE_NAME
    },
    spreadsheet : {
        url : process.env.SPREADSHEET_URL
    },
}

export default config;