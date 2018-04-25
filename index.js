var app = new Vue({
    el: '#app',
    data: {
        productList: []
    },
    methods: {
        addProductNum(product) {
            let XianYuItem = Bmob.Object.extend("XianYuItem");
            let query = new Bmob.Query(XianYuItem);
            query.get(product.id, {
                success: function(xianYuItem) {
                    let addConfirm = confirm("确定数量 + 1 吗？");
                    if (addConfirm) {
                        console.log(product);
                        xianYuItem.fetchWhenSave(true);
                        xianYuItem.set('sellCount', product.sellCount + 1);
                        xianYuItem.save();
                        product.sellCount = product.sellCount + 1;
                        for (let i = 0; i < app.productList.length; i++) {
                            if (app.productList[i].id == product.id) {
                                Vue.set(app.productList, i, product);
                            }
                        }
                    } else {
                        console.log("取消增加数量...");
                    }
                },
                error: function(object, error) {
                    console.log(error);
                }
            });            
        },
        generateDeliveryContent(product) {
            let clipBoardContent = "====================\n" +
            "亲~收货了~\n" +
            product.name + "\n" +
            "请您先保存到自己网盘后再观看或下载噢\n" +
            "链接：" + product.panLink + "\n" +
            "祝您学习愉快~\n" +
            "====================\n";
            
            this.copytoClipboard(clipBoardContent);
        },
        generateDeployContent(product) {
            let clipBoardContent = product.name +
             "，内容见截图，全套资料低价打包带走，请勿议价，拍下发百度网盘链接。PS:网络电子资料，一旦售出概不退货，拍前请留意谢谢。";

            this.copytoClipboard(clipBoardContent);
        },
        copytoClipboard(text) {
            var template = document.getElementById("copy-template");
            template.innerHTML = text;
            template.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            alert("已复制好，可贴粘。");
            template.innerHTML = "";
        },
        getXianYuList() {
            let XianYuItem = Bmob.Object.extend("XianYuItem");
            let query = new Bmob.Query(XianYuItem);
            query.find({
                success: function(results) {
                //console.log("共查询到 " + results.length + " 条记录");
                // 循环处理查询到的数据
                for (let i = 0; i < results.length; i++) {
                    let object = results[i];
                    //console.log(object.id + ' - ' + object.get('name'));
                    let item = {
                        id: object.id,
                        name: object.get('name'),
                        price: object.get('price'),
                        sellCount: object.get('sellCount'),
                        panLink: object.get('panLink'),
                        isUp: object.get('isUp'),
                        content: object.get('content')
                    }
                    app.productList.push(item);
                    console.log(app.productList[i].id);
                }
                },
                error: function(error) {
                console.log("查询失败: " + error.code + " " + error.message);
                }
            });
        }
    },
    mounted: function() {
        Bmob.initialize("55432a69e0efff6ec4a8ade94751a978", "94342d6f5c024f58c754618ecf25444b");
        this.getXianYuList();
        
    }
});