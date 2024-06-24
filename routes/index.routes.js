import express from 'express';
import AbsensiController from '../controllers/AbsensiController.js';

const router = express.Router();
const absensiController = new AbsensiController();

absensiController.consumeMessages();

export default router;