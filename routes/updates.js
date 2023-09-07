const express = require('express');
const router = express.Router();
const Update = require('../model/updates');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })
const { cloudinary } = require('../cloudinary');
const mongoosePaginate = require('mongoose-paginate-v2');
const { addLoadingVariable } = require('../middleware')
const nodemailer = require('nodemailer')
const catchAsync = require('../utils/CatchAsync')



router.get('/updates', catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const options = {
        sort: { createdAt: 'desc' },
        page: page,
        limit: pageSize
    };

    // Fetch the latest update
    const latestUpdate = await Update.findOne({}, {}, { sort: { createdAt: -1 } });

    // Fetch the four previous updates (excluding the latest one)
    const previousUpdates = await Update.find({ _id: { $ne: latestUpdate._id } }, {}, options).limit(4);

    res.render('updates/index', { latestUpdate, previousUpdates });
}));





router.get('/new', (req, res) => {
    res.render('articles/new');

})

router.post('/newUpdates', upload.array('image'), catchAsync(async (req, res) => {
    try {
        const update = new Update(req.body.update);
        update.images = req.files.map(i => ({ url: i.path, filename: i.filename }));
        const saveupdate = update.save();
        console.log(saveupdate)
        // Wait for the update to be saved, then redirect
        await saveupdate;
        req.flash('success', "Successfully added a new Update")
        res.redirect('/updates');
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
}));




router.get('/updates/:id', catchAsync(async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('updates/show', { update });

}))




// router.put('/:id', upload.array('image'), catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const article = await Article.findByIdAndUpdate(id, { ...req.body.article });
//     const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
//     article.images.push(...imgs);
//     await article.save()
//     if (req.body.deleteImages) {
//         for (let filename of req.body.deleteImages) {
//             await cloudinary.uploader.destroy(filename);
//         }
//         await article.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
//     }
//     req.flash('success', 'Updated')
//     res.redirect(`/articles/${article._id}`);

// }))





// router.delete('/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Article.findByIdAndDelete(id);
//     res.redirect('/articles');

// }))





module.exports = router;