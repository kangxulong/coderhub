const commentService = require("../service/comment.service")

class CommentController {
	async create(ctx, next) {
		try {
			const { momentId, content } = ctx.request.body;
			const { id } = ctx.user;

			const result = await commentService.create(momentId, id, content);

			ctx.body = result;
		} catch (error) {
      console.log(error);
    }
	}
  async reply(ctx,next) {
    const {commentId} = ctx.params;
    const {momentId,content} = ctx.request.body;
    const {id} = ctx.user;

    const result = await commentService.reply(momentId, id, content, commentId);
    ctx.body = result;
  }
  async update(ctx,next) {
    const {commentId} = ctx.params
    const {content} = ctx.request.body;

    const result = await commentService.update(commentId,content);
    ctx.body = result;
  }
  async remove(ctx,next) {
    const {commentId} = ctx.params;
    const result = await commentService.remove(commentId);
    ctx.body = result;
  }
  async list(ctx,next) {
    console.log(`执行获取评论列表`);
    const {momentId} = ctx.query;
    console.log(momentId);
    const result = await commentService.getCommentsByMomentId(momentId);
    console.log(result);
    ctx.body = result;
  }
}

module.exports = new CommentController();
