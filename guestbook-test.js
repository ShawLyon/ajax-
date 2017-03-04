/**
 * Created by Administrator on 2017/3/2.
 */

window.onload = function (){
    var oUsername1 = document.querySelector('#username1');
    var oVerifyUserNameMsg = document.querySelector('#verifyUserNameMsg');
    var oUser = document.querySelector('#user');
    var reg = document.querySelector('#reg');
    var login = document.querySelector('#login');
    var oUserinfo = document.querySelector('#userinfo');
    var ipage = 1;
    var oHeader = document.querySelector('#header');
    //初始化
    updateUserStatus();
    showList();


    function updateUserStatus(){
        var uid =  getCookie('uid');
        var username =  getCookie('username');
        if (uid){
            //如果登录成功
            oUser.style.display = 'block';
            reg.style.display = 'none';
            login.style.display = 'none';
            oUserinfo.innerHTML = username;
        } else{
            //如果退出
            oUser.style.display = 'none';
            reg.style.display = 'block';
            login.style.display = 'block';
            oUserinfo.innerHTML = username;
        }
    }


    /*验证用户*/
    oUsername1.onblur = function (){
        ajax("get","guestbook/index.php","m=index&a=verifyUserName&username="+this.value,function (data){
            var d = JSON.parse(data);
            oVerifyUserNameMsg.innerHTML = d.message;
            if (d.code == 0){
                oVerifyUserNameMsg.style.color = 'green';
            } else{
                 oVerifyUserNameMsg.style.color = 'red';
            }
        });
    }
    /*注册*/
    /*
        请求方式: get/post
        url: guestbook/index.php
        m: index
        a: reg
        username: 用户输入的账户
        password: 用户输入的密码

    */
    var oBtnReg = document.querySelector('#btnReg');
    var oPassword1 = document.querySelector('#password1');
    oBtnReg.onclick = function (){
        ajax('post','guestbook/index.php','m=index&a=reg&username='+encodeURI(oUsername1.value)+'&password='+oPassword1.value, function (data){
                var d = JSON.parse(data);
                alert(d.message);
        })
    }
    /*登录*/
    /*
        请求方式: post
        url: guestbook/index.php
        m: index
        a: login
        username: 用户登录账户
        password: 用户登录密码

    */
    var oUsername2 = document.querySelector('#username2');
    var oPassword2 = document.querySelector('#password2');
    var oBtnLogin = document.querySelector('#btnLogin');


    oBtnLogin.onclick  = function (){
        ajax('post','guestbook/index.php','m=index&a=login&username='+encodeURI(oUsername2.value)+'&password='+oPassword2.value, function (data){
            var d = JSON.parse(data);
            alert(d.message);
            // 登录成功
            updateUserStatus();

        });

    }

    /*退出登录*/
    /*
        请求方式: post
        url: guestbook/index.php
        m: index
        a: logout
        username: 用户登录账户
        password: 用户登录密码

    */
    var oLogout = document.querySelector('#logout');
    oLogout.onclick = function (){
        ajax('post','guestbook/index.php','m=index&a=logout', function (data){
            var d = JSON.parse(data);
            // alert(d.message);
            if (!d.code){
                //如果退出成功
                alert(d.code);
                updateUserStatus();
            }
        })
        return false; //阻止a标签跳转
    }

    /*留言*/
    /*
        请求方式: post
        url: guestbook/index.php
        m: index
        a: send
        content: content

        返回 {

            code: 0 无错误  1 有错误
            message: '成功或失败'
            data: {
                cid: 留言id
                content: 留言的内容
                dateline: 时间戳
                oppose: 顶的数量
                support: 踩的数量
                uid: 用户id
                username: 用户
            }

        }

    */
    var oContent = document.querySelector('#content');
    var oBtnPost = document.querySelector('#btnPost');
    var oList = document.querySelector('#list');
    oBtnPost.onclick = function (){
        ajax('post','guestbook/index.php','m=index&a=send&content='+encodeURI(oContent.value), function (data){
            var d = JSON.parse(data);
            alert(d.message);
            if (!d.code){
                //留言成功
                createLiuyan(d.data);
            }
        })
    }
    function createLiuyan(data){
        var oDl = document.createElement('dl');
        var oDt = document.createElement('dt');
        var oStrong = document.createElement('strong');
        oStrong.innerHTML = data.username;
        oDt.appendChild(oStrong);

        var oDd1 = document.createElement('dd');
        oDd1.innerHTML = data.content;
        var oDd2 = document.createElement('dd');
        oDd2.className = 't';
        var oA1 = document.createElement('a');
        oA1.setAttribute('href','');
        oA1.setAttribute('id','oppose');
        oA1.innerHTML = '顶(<span>'+data.oppose+'</span>)';
        var oA2 = document.createElement('a');
        oA2.setAttribute('href','#');
        oA2.setAttribute('id','support');
        oA2.innerHTML = '踩(<span>'+data.support+'</span>)';
        oDd2.appendChild(oA1);
        oDd2.appendChild(oA2);

        oDl.appendChild(oDt);
        oDl.appendChild(oDd1);
        oDl.appendChild(oDd2);


        if(oList.children[0]){//如果有留言
            oList.insertBefore(oDl,oList.children[0]);
        } else{
            oList.appendChild(oDl);
        }
    }


    /*显示更多*/
    var oShowMore = document.querySelector('#showMore');
    oShowMore.onclick = function (){
        ipage++;
        showList();
    }




    function showList(){
    /*
    初始化留言列表
    get
        guestbook/index.php
            m : index
            a : getList
            page : 获取的留言的页码，默认为1
            n : 每页显示的条数，默认为10
        返回
            {
                code : 返回的信息代码 0 = 没有错误，1 = 有错误
                data : 返回成功的留言的详细信息
                    {
                        cid : 留言id
                        content : 留言内容
                        uid : 留言人的id
                        username : 留言人的名称
                        dateline : 留言的时间戳(秒)
                        support : 当前这条留言的顶的数量
                        oppose : 当前这条留言的踩的数量
                    }
                message : 返回的信息 具体返回信息
            }
    */
        ajax('get','guestbook/index.php','m=index&a=getList&n=5&page='+ipage,function (data){
            var d = JSON.parse(data);
            var data = d.data;
            if (data){
                for (var i=0; i<data.list.length; i++){
                    createLiuyan(data.list[i]);
                }
            } else{
                if (ipage == 1){
                    oShowMore.style.display = 'none';
                    oList.innerHTML = '还没有留言,请留言吧!';
                }
                alert(d.message);
            }

        })
    }


};






    /*获取cookie函数*/
    function getCookie(key){
        var arr1 = document.cookie.split('; ');
        for (var i=0; i<arr1.length; i++){
            // var self = i;
            var arr2 = arr1[i].split('=');
            if (arr2[0] == key){
                // alert(arr2[1]);
                return arr2[1];
            }
        }
    }
