const service = require("../service/label.service")

const verifyLabelExists = async(ctx,next) => {
  // 取出所有的label
  const {labels} = ctx.request.body;

  // 查询所有label是否在数据库中，如果不在则添加数据
  const newLabels = [];
  for(let name of labels) {
    const labelResult = await service.getLabelByName(name);
    // 设置label对象
    const label = {name};
    if(!labelResult) {
      const result = await service.create(name);
      // 如果没有这个name，则进行添加标签操作，且给label对象添加id属性
      label.id = result.insertId
    }else{
      // 如果存在这个标签，则直接创建id标签
      label.id = labelResult.id
    }
    // 将label对象推入newLabels数组中
    newLabels.push(label);
  }

  console.log(newLabels);
  // 为ctx创建labels属性
  ctx.labels = newLabels;
  await next()
}

module.exports = {
  verifyLabelExists
}