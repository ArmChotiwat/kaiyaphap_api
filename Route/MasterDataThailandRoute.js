const express = require('express');
const router = express.Router();

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);


const listAllProvinceThailand = require('../Controller/masterDataController').listAllProvinceThailand;
router.get( // Master Data Thailand, GET All Province
    '/province',
    async function (req, res) {
        const provinceAllData = await listAllProvinceThailand((err) => { if(err) { console.error(err); res.status(422).end(); }});
        if (!provinceAllData) {
            res.status(200).end();
        }
        else {
          res.status(200).json(provinceAllData).end();
        }
    }
);

const listAllAmphureThailand = require('../Controller/masterDataController').listAllAmphureThailand;
router.get( // Master Data Thailand, GET All Amphure
    '/amphure',
    async function (req, res) {
      const amphureAllData = await listAllAmphureThailand((err) => { if(err) { console.error(err); res.status(422).end(); }});
      if (!amphureAllData) {
        res.status(200).end();
      }
      else {
        res.status(200).json(amphureAllData).end();
      }
    }
);

const listAllDistrictThailand = require('../Controller/masterDataController').listAllDistrictThailand;
router.get(
    '/district',
    async function (req, res) {
      const districtAllData = await listAllDistrictThailand((err) => { if(err) { console.error(err); res.status(422).end(); }});
      if (!districtAllData) {
        res.status(200).end();
      }
      else {
        res.status(200).json(districtAllData).end();
      }
    }
);



module.exports = router;