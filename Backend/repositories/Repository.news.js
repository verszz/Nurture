const { pool } = require("../config/db.config.js");
const bcrypt = require("bcrypt");

const addNews = async (title, content, sources, writer, images = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const newsResult = await client.query(
      `INSERT INTO nurture_newsletter (title, content, sources, writer, created_time, modified_time)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
      [title, content, sources, writer]
    );

    const newsletterId = newsResult.rows[0].id;

    for (const imageUrl of images) {
      await client.query(
        `INSERT INTO nurture_newsletter_images (newsletter_id, image_url) VALUES ($1, $2)`,
        [newsletterId, imageUrl]
      );
    }

    await client.query('COMMIT');
    return newsletterId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteNews = async (id) => {
  try {
    const result = await pool.query(
      `DELETE FROM nurture_newsletter WHERE id = $1`,
      [id]
    );
    return result.rowCount > 0;
  } catch (error) {
    throw error;
  }
};

const getNews = async (Title, username) => {
  try {
    const News = await pool.query(
      'SELECT n.id, n.title, n.Writer, n.content, n.modified_time, i.image_url FROM nurture_newsletter n LEFT JOIN nurture_newsletter_images i ON n.id = i.newsletter_id WHERE n.title = $1 AND n.Writer = $2',
      [Title, username]
    );
    return News.rows
  } catch (error) {
    console.error('Error fetching news:', error); 
        throw new Error('Error fetching news'); 
  }
};

const getAllNews = async () => {
  try {
    const allNews = await pool.query(`
      SELECT 
        n.id, 
        n.title, 
        n.sources, 
        n.Writer, 
        n.content, 
        n.modified_time, 
        ARRAY_AGG(i.image_url) AS images
      FROM 
        nurture_newsletter n
      LEFT JOIN 
        nurture_newsletter_images i 
      ON 
        n.id = i.newsletter_id
      GROUP BY 
        n.id, n.title, n.sources, n.Writer, n.content, n.modified_time;
    `);
    return allNews.rows;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Error fetching news');
  }
};

const editNews = async (id, title, content, sources, writer, images = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE nurture_newsletter
       SET title = $1, content = $2, sources = $3, writer = $4, modified_time = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [title, content, sources, writer, id]
    );

    await client.query(
      `DELETE FROM nurture_newsletter_images WHERE newsletter_id = $1`,
      [id]
    );

    for (const imageUrl of images) {
      await client.query(
        `INSERT INTO nurture_newsletter_images (newsletter_id, image_url) VALUES ($1, $2)`,
        [id, imageUrl]
      );
    }

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  addNews,
  deleteNews,
  editNews,
  getNews,
  getAllNews
};