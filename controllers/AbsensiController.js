import amqp from 'amqplib';
import config from '../config/index.js';
import axios from 'axios';
import { queryAbsensi } from '../query/absensiQuery.js';
import { pool_hr } from '../db/db.js';
import moment from 'moment';

class AbsensiController {
    channel;

    constructor() {
        this.pool_hr = pool_hr;
        this.queryAbsensi = queryAbsensi;
    }

    async connect() {
        try {
          const connection = await amqp.connect(config.rabbitMQ.url);
          this.channel = await connection.createChannel();
        } catch (error) {
          throw new Error("Could not connect to RabbitMQ: " + error.message);
        }
    }

    async consumeMessages() {
        if (!this.channel) {
          await this.connect();
        }
      
        const exchangeName = config.rabbitMQ.exchangeName;
        const queueName = config.rabbitMQ.queueName;
        await this.channel.assertExchange(exchangeName, "direct");
        await this.channel.assertQueue(queueName, {
          durable: true,
          arguments: {
            "x-queue-type": "quorum",
            "x-delivery-limit": 1,
            // Tambahkan opsi konfigurasi antrian quorum lainnya jika diperlukan
          },
        });

        this.channel.consume(queueName, async (msg) => {
            // console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            const messageContent = msg.content.toString();
            let data;
            data = JSON.parse(messageContent);
            const { branch_company_id, nip, tgl, jam, status } = { ...data.data };
            let jamNew = moment(jam, "HH:mm:ss").subtract(1, 'hours').format("HH:mm:ss");
            try {
                const dataDb = [
                    [branch_company_id,
                    nip,
                    tgl,
                    jamNew,
                    status]
                ];

                await this.pool_hr.query(this.queryAbsensi, [dataDb]);
                
                const result = await this.sendSpreadsheet(
                    nip,
                    tgl,
                    jamNew,
                    status,
                );
    
                return result;
            } catch (error) {
                throw new Error(
                  "Could not send message to endpoint: " + error.message
                );
            }
              
          }, {
            noAck: true
        });
    }

    async sendSpreadsheet(
        nip,
        tgl,
        jamNew,
        status) {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
              };
              const data = new URLSearchParams({
                nip,
                tgl,
                jamNew,
                status,
              }).toString();
            
              try {
                const result = await axios.post(config.spreadsheet.url, data, { headers });
                return result;
              } catch (error) {
                throw new Error("Could not send data to spreadsheet: " + error.message);
              }
    }
}

export default AbsensiController;