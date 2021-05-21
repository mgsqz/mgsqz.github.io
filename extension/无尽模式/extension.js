game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"无尽模式",content:function (config,pack){
    
},precontent:function (){
    if(lib.config.mode_config.wjms==undefined){
        lib.config.mode_config.wjms={};
        lib.config.mode_config.wjms.gk_num=3;
        game.saveConfig('gk_num',3,'wjms');
    };
    //var gk={};
    if(lib.config.wjms.characterlist==undefined) lib.config.wjms.characterlist=[];//已击败武将
    if(lib.config.wjms.card==undefined) lib.config.wjms.card={//卡牌状态
        e:{},
        h:{},
        j:{},
    }
    if(lib.config.wjms.status==undefined) lib.config.wjms.status={};//武将状态
    if(lib.wjms_gk==undefined) lib.wjms_gk={};
    game.wjms_getEvent=function(character){
        var gk=lib.wjms_gk;
        var list=[];
        var list_forbidai=[];
        for(var i in lib.character){
            var character=lib.character[i];
            if(character[4]!=undefined&&character[4].contains('forbidai')){
                list_forbidai.push(i);
            };
        };
        for(var i in gk){
            if(character==true&&gk[i].character==undefined) continue;
            if(list_forbidai.contains(i)) continue;
            if(lib.config.wjms.characterlist.contains(i)) continue;
            list.push(i);
        };
        var bool=list.randomGet();
        return bool;
    };
    if(lib.config.wjms==undefined){
        lib.config.wjms={};
        game.saveConfig('wjms',lib.config.wjms);
    };
    var bool=false;
    if(lib.config.wjms.maxRound==undefined){
        lib.config.wjms.maxRound=1;
        bool=true;
    };
    if(bool==true) game.saveConfig('wjms',lib.config.wjms);
    if(lib.config['extension_扩展ol_mode_hide_wjms']==true) return ;
    lib.arenaReady.push(function(){
        ui.wjms_bs=ui.create.system('',null,true);
        ui.wjms_bs.style.display='none';
        //var str='未开始';
        //if(lib.config.wjms.round!=undefined) str='第'+lib.config.wjms.round+'轮';
        ui.wjms_bs.innerHTML='未开始';
        lib.setPopped(ui.wjms_bs,function(){
            var uiintro=ui.create.dialog('hidden');
            //uiintro.style['text-align']='justify';
            uiintro.listen(function(e){
                e.stopPropagation();
            });
            var str='最高到达第'+lib.config.wjms.maxRound+'轮';
            uiintro.add(str);
            return uiintro;
        },220);
    });
    game.addMode('wjms',{
        start:function(){
            'step 0'
            _status.mode=get.config('mode');
            lib.onover.push(function(result){
                for(var i=0;i<ui.control.childElementCount;i++){
                    var control=ui.control.childNodes[i];
                    if(control.innerText=='重新开始'){
                        control.close();
                    };
                };
                if(result==true){
                    ui.create.control('返回',function(){
                        ui.dialog.delete();
                        this.close();
                        ui.window.style.display='none';
                        setTimeout(function(){
                            ui.window.style.display='';
                            delete _status.gameStarted;
                            game.wjms_deleteChoice();
                            lib.config.wjms.round+=1;
                            if(lib.config.wjms.maxRound==undefined||
                            lib.config.wjms.round>lib.config.wjms.maxRound) lib.config.wjms.maxRound=lib.config.wjms.round;
                            for(var i=0;i<lib.config.mode_config.wjms.gk_num;i++){
                                lib.config.wjms['choice'+i]=game.wjms_getEvent();
                            };
                            var Thp=game.me.hp;
                            var TmaxHp=game.me.maxHp;
                            lib.config.wjms.hp=Thp;
                            lib.config.wjms.maxHp=TmaxHp;
                            game.saveConfig('wjms',lib.config.wjms);
                            ui.sortCard.style.display='none';
                            if(_status.auto==true){
                                ui.control.show();
                                _status.auto=false;
                                ui.auto.classList.remove('glow');
                                ui.arena.classList.remove('auto');
                            };
                            ui.cardPileButton.style.display='none';
                            game.wjms_openChoice();
                            delete _status.over;
                            game.loop=function(){};
                            ui.control.innerHTML='';
                            ui.arenalog.innerHTML='';
                            var nodes=[];
                            for(var i=0;i<ui.arena.childNodes.length;i++){
                                nodes.push(ui.arena.childNodes[i]);
                            }
                            for(var i=0;i<nodes.length;i++){
                                if(nodes[i]==ui.canvas) continue;
                                if(nodes[i]==ui.control) continue;
                                if(nodes[i]==ui.arenalog) continue;
                                if(nodes[i]==ui.roundmenu) continue;
                                if(nodes[i]==ui.timer) continue;
                                if(nodes[i]==ui.autonode) continue;
                                nodes[i].remove();
                            }
                            ui.sidebar.innerHTML='';
                            ui.cardPile.innerHTML='';
                            ui.discardPile.innerHTML='';
                            ui.special.innerHTML='';
                            ui.ordering.innerHTML='';
                            ui.playerids.remove();
                            game.players.length=0;
                            game.dead.length=0;
                            game.me=null;
                            ui.pause.classList.add('hidden');
                            ui.arena.delete();
                            ui.window.classList.remove('leftbar');
                            ui.window.classList.remove('rightbar');
                            setTimeout(function(){
                                for(var i in _status.wjms_divs){
                                    _status.wjms_divs[i].show();
                                };
                            },500);
                        },200);
                    });
                }else{
                    var str='轮回重启';
                    ui.create.control(str,function(){
                        this.close();
                        for(var i in lib.config.wjms){
                            if(i=='maxRound') continue;
                            delete lib.config.wjms[i];
                        };
                        game.saveConfig('wjms',lib.config.wjms);
                        game.reload();
                    });
                };
            });
            /*lib.config.phonelayout=false;
			ui.css.phone.href='';
		    ui.arena.classList.remove('phone');*/
            //game.over=game.wjms_over;
            for(var i in lib.character){
                lib.wjms_gk[i]={
                    name:'挑战'+get.translation(i),
                    character:i,
                };
            };
            ui.arena.delete();
            ui.window.classList.remove('leftbar');
            ui.window.classList.remove('rightbar');
            ui.sortCard.style.display='none';
            _status.wjms_divs={};
            _status.wjms_divs1={};
            _status.wjms_divs2={};
            ui.wjms_bs.style.display='';
            setInterval(function(){
                var str='未开始';
                if(lib.config.wjms.round!=undefined) str='第'+lib.config.wjms.round+'轮';
                ui.wjms_bs.innerHTML=str;
            },500);
            ui.window.hide();
            setTimeout(function(){
                ui.window.show();
            },500);
            if(lib.config.wjms.character==undefined){
                game.wjms_chooseCharacter();
            }else{
                game.wjms_menu(lib.config.mode_config.wjms.gk_num);
            };
            var background=ui.create.dialog('hidden');
            background.style.height='calc(100%)';
            background.style.width='calc(100%)';
            background.style.left='0px';
            background.style.top='0px';
            ui.window.appendChild(background);
            _status.wjms_divs1.background=background;
            var div1=ui.create.div();
            div1.style.height='100%';
            div1.style.width='100%';
            div1.style.left='0px';
            div1.style.top='0px';
            div1.onclick=function(){
                for(var i in _status.wjms_divs1){
                    _status.wjms_divs1[i].hide();
                };
                for(var i in _status.wjms_divs){
                    _status.wjms_divs[i].show();
                };
            };
            background.appendChild(div1);
            _status.wjms_divs1.div1=div1;
            var dialog=ui.create.dialog('hidden');
            dialog.style.height='calc(88%)';
            dialog.style.width='calc(88%)';
            dialog.style.left='calc(6%)';
            dialog.style.top='calc(6%)';
            dialog.classList.add('popped');
            dialog.classList.add('static');
            ui.window.appendChild(dialog);
            _status.wjms_divs1.dialog=dialog;
            for(var i in _status.wjms_divs1){
                _status.wjms_divs1[i].hide();
            };
            var avatar=ui.create.div('.player');
            avatar.style.height='calc(50%)';
            avatar.style.width='calc(20%)';
            avatar.style.left='calc(2%)';
            avatar.style.top='calc(2%)';
            if(lib.config.wjms.character!=undefined) avatar.setBackground(lib.config.wjms.character,'character');
            dialog.appendChild(avatar);
            _status.wjms_divs1.avatar=avatar;

            var characterinfo=ui.create.div('');//武将信息详情
            characterinfo.style.height='calc(96%)';
            characterinfo.style.width='calc(60%)';
            characterinfo.style.left='calc(30%)';
            characterinfo.style.top='calc(2%)';
            characterinfo.style['font-size']='18px';
            characterinfo.style['text-align']='left';
            characterinfo.style['font-family']="'yuanli'";
            setInterval(function(){
                if(lib.config.wjms.card!=undefined){
                    var eStr='装备：';
                    for(var i in lib.config.wjms.card.e ){
                        eStr+=lib.config.wjms.card.e[i].CNname
                    }
                    var hStr='手牌：';
                    for(var i in lib.config.wjms.card.h ){
                        hStr+=lib.config.wjms.card.h[i].CNname
                    }
                    var jStr='判定：';
                    for(var i in lib.config.wjms.card.j ){
                        jStr+=lib.config.wjms.card.j[i].CNname
                    }
                    var wjstatus='状态：'
                    if (lib.config.wjms.status.link) {wjstatus+='【已连环】';}
                    else {wjstatus+='【未连环】';}
                    if (lib.config.wjms.status.turn) {wjstatus+='【已翻面】';}
                    else {wjstatus+='【未翻面】';}
                }
                if(lib.config.wjms.characterlist!=undefined){
                    var wjlist='已经击败武将：';
                    for(var i=0;i<lib.config.wjms.characterlist.length;i++){
                        wjlist=wjlist+'【'+get.translation(lib.config.wjms.characterlist[i])+'】';
                    }
                }
                characterinfo.innerHTML='<p>'+wjstatus+'</p><p>'+eStr+'</p><p>'+hStr+'</p><p>'+jStr+'</p><p>'+wjlist+'</p>';
            },500);
            dialog.appendChild(characterinfo);
            _status.wjms_divs1.characterinfo=characterinfo;

            var name=ui.create.div('');
            name.style.width='calc(20%)';
            name.style.height=(avatar.offsetHeight-20)+'px';
            name.style.left='calc(2%)';
            name.style.top='calc(2%)';
            name.style['font-size']='25px';
            name.style['font-family']="'STXinwei','xinwei'";
            setInterval(function(){
                if(lib.config.wjms.character!=undefined) name.innerHTML=get.translation(lib.config.wjms.character);
            },500);
            avatar.appendChild(name);
            _status.wjms_divs1.name=name;
            var hp=ui.create.div('');
            hp.style.width='calc(96%)';
            hp.style.height='calc(10%)';
            hp.style.left='calc(2%)';
            hp.style.bottom='calc(1%)';
            hp.style['font-size']='18px';
            hp.style['text-align']='right';
            hp.style['font-family']="'STXinwei','xinwei'";
            setInterval(function(){
                if(lib.config.wjms.hp!=undefined&&lib.config.wjms.maxHp!=undefined){
                    hp.innerHTML='体力：'+lib.config.wjms.hp+'/'+lib.config.wjms.maxHp;
                };
            },500);
            avatar.appendChild(hp);
            _status.wjms_divs1.hp=hp;
            _status.wjms_event=event;
        },
        game:{
            wjms_clickAnimation:function(div){
                div.style.transition='opacity 0.5s';
                div.addEventListener(lib.config.touchscreen?'touchstart':'mousedown',function(){
                    this.style.transform='scale(0.95)';
                });
                div.addEventListener(lib.config.touchscreen?'touchend':'mouseup',function(){
                    this.style.transform='';
                });
                div.onmouseout=function(){
                    this.style.transform='';
                };
            },
            wjms_meet:function(gk){
                if(gk.character!=undefined){
                    if(_status.wjms_divs!=undefined){
                        for(var i in _status.wjms_divs){
                            _status.wjms_divs[i].hide();
                        };
                    };
                    ui.window.appendChild(ui.arena);
                    if(lib.config.show_history=='left'){
                        ui.window.classList.add('leftbar');
                        ui.window.classList.remove('rightbar');
                    }else if(lib.config.show_history=='right'){
                        ui.window.classList.remove('leftbar');
                        ui.window.classList.add('rightbar');
                    }else{
                        ui.window.classList.remove('leftbar');
                        ui.window.classList.remove('rightbar');
                    };
                    game.prepareArena(2);
                    if(lib.config['extension_十周年UI_enable']==true){
                        if(window.decadeUI&&window.decadeUI.animate&&window.decadeUI.animate.frames){
                            window.decadeUI.animate.arena=ui.arena.appendChild(document.createElement('canvas'));
                            window.decadeUI.animate.frames[2].canvas=window.decadeUI.animate.arena;
                        };
                    };
                    if(ui.auto) ui.auto.show();
                    for(var i=0;i<game.players.length;i++){
                        var pl=game.players[i];
                        pl.getId();
                        if(pl==game.me){
                            pl.identity='me';
                        }else{
                            pl.identity='enemy';
                        };
                    };
                    game.me.init(lib.config.wjms.character);
                    game.me.maxHp=lib.config.wjms.maxHp;
                    game.me.hp=lib.config.wjms.hp;
                    game.me.next.init(gk.character);
                    game.me.update();
                    game.wjms_start();
                }else{
                    if(_status.wjms_divs!=undefined){
                        for(var i in _status.wjms_divs){
                            _status.wjms_divs[i].hide();
                        };
                    };
                    game.wjms_triggerGKEvent(gk);
                    lib.config.wjms.round+=1;
                    if(lib.config.wjms.maxRound==undefined||
                    lib.config.wjms.round>lib.config.wjms.maxRound) lib.config.wjms.maxRound=lib.config.wjms.round;
                    for(var i=0;i<lib.config.mode_config.wjms.gk_num;i++){
                        lib.config.wjms['choice'+i]=game.wjms_getEvent();
                    };
                    game.saveConfig('wjms',lib.config.wjms);
                    setTimeout(function(){
                        game.wjms_deleteChoice();
                        game.wjms_openChoice();
                        for(var i in _status.wjms_divs){
                            _status.wjms_divs[i].show();
                        };
                    },500);
                };
            },
            wjms_triggerGKEvent:function(gk){
                gk.func();
            },
            wjms_menu:function(num,bool){
                if(num==undefined) num=1;
                var str_dialog=ui.create.div();
                str_dialog.style.height='30px';
                str_dialog.style.width='calc(90%)';
                str_dialog.style.top='calc(12.5% - 15px)';
                str_dialog.style.left='calc(5%)';
                str_dialog.style['font-size']='30px';
                str_dialog.style['text-align']='center';
                str_dialog.style['font-family']="'STXinwei','xinwei'";
                str_dialog.style['line-height']='30px';
                str_dialog.innerHTML='请选择下一轮的事件（双击选择）';
                ui.window.appendChild(str_dialog);
                _status.wjms_divs.str_dialog=str_dialog;
                for(var i=0;i<num;i++){
                    var choice=ui.create.div('');
                    choice.style.height='400px';
                    choice.style.width='200px';
                    choice.style.top='calc(20%)';
                    var num1=ui.window.offsetWidth-parseInt(num)*200;
                    choice.style.left=(num1/(parseInt(num)+1)*(i+1)+200*i)+'px';
                    if(bool==true){
                        choice.style.animation='fadeShow .8s';
                        choice.style['-webkit-animation']='fadeShow .8s';
                    };
                    choice.style['cursor']='pointer';
                    choice.setBackgroundImage('extension/无尽模式/wjms_bg.png');
                    choice.style.backgroundSize="100% 100%";
                    choice.link=lib.config.wjms['choice'+i];
                    choice.ondblclick=function(){
                        var gk=lib.wjms_gk[this.link];
                        game.wjms_meet(gk);
                    };
                    ui.window.appendChild(choice);
                    _status.wjms_divs['choice'+i]=choice;
                };
                var zt=ui.create.div('.menu','<span style="cursor:pointer;">状态</span>');
                zt.style['font-size']='35px';
                zt.style['line-height']='40px';
                zt.style['font-family']="'STXinwei','xinwei'";
                zt.style['text-align']='center';
                zt.style.height='40px';
                zt.style.width='110px';
                zt.style.bottom='5px';
                zt.style.left='calc(100% - 115px)';
                zt.style.borderRadius='5px';
                zt.style.animation='fadelogIn .4s';
                zt.style['-webkit-animation']='fadelogIn .4s';
                zt.onclick=function(){
                    for(var i in _status.wjms_divs){
                        _status.wjms_divs[i].hide();
                    };
                    for(var i in _status.wjms_divs1){
                        _status.wjms_divs1[i].show();
                    };
                };
                game.wjms_clickAnimation(zt);
                ui.window.appendChild(zt);
                _status.wjms_divs.zt=zt;
                game.wjms_openChoice();
            },
            wjms_chooseCharacter:function(){
                var chooseCharacter_str=ui.create.dialog('hidden');
                chooseCharacter_str.style.height='30px';
                chooseCharacter_str.style.width='calc(90%)';
                chooseCharacter_str.style.top='calc(10% - 15px)';
                chooseCharacter_str.style.left='calc(5%)';
                chooseCharacter_str.style['font-size']='30px';
                chooseCharacter_str.style['text-align']='center';
                chooseCharacter_str.style['font-family']="'STXinwei','xinwei'";
                chooseCharacter_str.style['line-height']='30px';
                chooseCharacter_str.innerHTML='请选择进入无尽轮回的武将（双击选择）';
                ui.window.appendChild(chooseCharacter_str);
                var chooseCharacter=ui.create.characterDialog('heightset');
                chooseCharacter.style.height='calc(85%)'
                chooseCharacter.style.width='calc(90%)'
                chooseCharacter.style.top='calc(15%)'
                chooseCharacter.style.left='calc(5%)'
                ui.window.appendChild(chooseCharacter);
                var func=function(name){
                    chooseCharacter_str.delete();
                    chooseCharacter.delete();
                    lib.config.wjms.round=1;
                    lib.config.wjms.character=name;
                    for(var i in lib.character){
                        var character=lib.character[i];
                        if(i==name){
                            lib.config.wjms.hp=get.infoHp(character[2]);
                            lib.config.wjms.maxHp=get.infoMaxHp(character[2]);
                        };
                    };
                    for(var i=0;i<lib.config.mode_config.wjms.gk_num;i++){
                        if(lib.config.wjms['choice'+i]==undefined){
                            lib.config.wjms['choice'+i]=game.wjms_getEvent();
                        };
                    };
                    game.saveConfig('wjms',lib.config.wjms);
                    _status.wjms_divs1.avatar.setBackground(lib.config.wjms.character,'character');
                    game.wjms_menu(lib.config.mode_config.wjms.gk_num);
                };
                for(var i=0;i<chooseCharacter.buttons.length;i++){
                    var button=chooseCharacter.buttons[i];
                    button.ondblclick=function(){
                        func(this.link);
                    };
                };
            },
            wjms_loop:game.loop,
            wjms_start:function(){
                if(lib.config.show_sortcard) ui.sortCard.style.display='';
                if(ui.arena&&ui.arena.classList.contains('choose-character')) ui.arena.classList.remove('choose-character');
                if(lib.config.show_cardpile){
                    ui.cardPileButton.style.display='';
                }else{
                    ui.cardPileButton.style.display='none';
                };
                for(var i in lib.config.wjms.card.e ){//保留上局装备
                    var card=get.cardPile2(function(card){
                        return card.number==lib.config.wjms.card.e[i].number&&card.suit==lib.config.wjms.card.e[i].suit&&card.name==lib.config.wjms.card.e[i].name&&card.nature==lib.config.wjms.card.e[i].nature;
                    });
                    if(card){
                        game.me.gain(card,'gain2');
                        //game.me.chooseUseTarget(card,'nothrow','nopopup',true);
                        game.me.equip(card);
                    }/*else{
                        card=game.createCard(lib.config.wjms.card.h[i].name,lib.config.wjms.card.h[i].suit,lib.config.wjms.card.h[i].number,lib.config.wjms.card.h[i].nature);
                        game.me.gain(card,'gain2');
                        game.me.equip(card);
                    }*/
                }
                for(var i in lib.config.wjms.card.h ){//保留上局手牌
                    var card=get.cardPile2(function(card){
                        return card.number==lib.config.wjms.card.h[i].number&&card.suit==lib.config.wjms.card.h[i].suit&&card.name==lib.config.wjms.card.h[i].name&&card.nature==lib.config.wjms.card.h[i].nature;
                    });
                    if(card){
                        game.me.gain(card,'gain2');
                    }/*else{
                        card=game.createCard(lib.config.wjms.card.h[i].name,lib.config.wjms.card.h[i].suit,lib.config.wjms.card.h[i].number,lib.config.wjms.card.h[i].nature);
                        game.me.gain(card,'gain2');
                    }*/
                }
                for(var i in lib.config.wjms.card.j ){//保留上局判定
                    var card=get.cardPile2(function(card){
                        return card.number==lib.config.wjms.card.j[i].number&&card.suit==lib.config.wjms.card.j[i].suit&&card.name==lib.config.wjms.card.j[i].name&&card.nature==lib.config.wjms.card.j[i].nature;
                    });
                    if(card){
                        game.me.addJudge(lib.config.wjms.card.j[i].viewAs,card);
                    }/*else{
                        card=game.createCard(lib.config.wjms.card.h[i].name,lib.config.wjms.card.h[i].suit,lib.config.wjms.card.h[i].number,lib.config.wjms.card.h[i].nature);
                        game.me.addJudge(lib.config.wjms.card.j[i].viewAs,card);
                    }*/
                }
                if (lib.config.wjms.status.link) game.me.link();//保留连环状态
                if (lib.config.wjms.status.turn) game.me.turnOver();//保留翻面状态
                game.me.next.draw(4);
                game.gameDraw();
                var pl=game.players.randomGet();
                game.phaseLoop(pl);
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].identity==pl.identity){
                        game.players[i].setIdentity('先');
                        game.players[i].node.identity.dataset.color='zhu';
                    }else{
                        game.players[i].setIdentity('后');
                        game.players[i].node.identity.dataset.color='fan';
                    };
                };
                game.loop=game.wjms_loop;
                game.loop();
                if(lib.config['extension_十周年UI_enable']==true){
                    setTimeout(function(){
                        _status.event.trigger('gameStart');
                    },200);
                }else{
                    _status.event.trigger('gameStart');
                };
            },
            wjms_openChoice:function(){
                var num=0;
                for(var i in _status.wjms_divs){
                    if(i.indexOf('choice')!=-1){
                        var div=_status.wjms_divs[i];
                        div.link=lib.config.wjms['choice'+num];
                        var gk=lib.wjms_gk[div.link];
                        var name=ui.create.div('');
                        name.style.height='25x';
                        name.style.width='calc(100% - 10px)';
                        name.style.left='5px';
                        name.style.bottom='90px';
                        name.style['font-size']='25px';
                        name.style['text-align']='center';
                        name.style['font-family']="'STXinwei','xinwei'";
                        //name.style['line-height']='25px';
                        name.style['background-image']='linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))';
                        name.style['box-shadow']='rgba(0, 0, 0, 0.4) 0 0 0 1px, rgba(0, 0, 0, 0.2) 0 3px 10px';
                        name.innerHTML=gk.name;
                        div.appendChild(name);
                        if(gk.character!=undefined){
                            var character_div=ui.create.button(gk.character,'character',div,true);
                            character_div.style.width='100px';
                            character_div.style.height='120px';
                            character_div.style.left='calc(50% - 50px)';
                            character_div.style.top='110px';
                            character_div.style.margin='0px';
                            character_div.link=gk.character;
                            lib.setIntro(character_div);
                            //div.appendChild(character_div);
                        }
                        num++;
                    };
                };
            },
            wjms_deleteChoice:function(){
                for(var i in _status.wjms_divs){
                    if(i.indexOf('choice')!=-1){
                        var num=0;
                        for(var j=0;j<_status.wjms_divs[i].childNodes.length;j++){
                            num++;
                        };
                        for(var j=0;j<num;j++){
                            _status.wjms_divs[i].removeChild(_status.wjms_divs[i].childNodes[0]);
                        };
                    };
                };
            },
        },
        element:{
            player:{
                dieAfter:function(source){
                    if(game.countPlayer(function(current){return current.identity=='enemy'})==0){
                        var list=lib.config.wjms.characterlist;
                        lib.config.wjms.characterlist.push(this.name);
                        lib.config.wjms.card.e={};
                        for(var i=0;i<game.me.getCards('e').length;i++){
                            lib.config.wjms.card.e[i]={};
                            lib.config.wjms.card.e[i].name=game.me.getCards('e')[i].name;
                            lib.config.wjms.card.e[i].suit=game.me.getCards('e')[i].suit;
                            lib.config.wjms.card.e[i].number=game.me.getCards('e')[i].number;
                            lib.config.wjms.card.e[i].nature=game.me.getCards('e')[i].nature;
                            lib.config.wjms.card.e[i].CNname=get.translation(game.me.getCards('e')[i]);
                        }
                        lib.config.wjms.card.h={};
                        for(var i=0;i<game.me.getCards('h').length;i++){
                            lib.config.wjms.card.h[i]={};
                            lib.config.wjms.card.h[i].name=game.me.getCards('h')[i].name;
                            lib.config.wjms.card.h[i].suit=game.me.getCards('h')[i].suit;
                            lib.config.wjms.card.h[i].number=game.me.getCards('h')[i].number;
                            lib.config.wjms.card.h[i].nature=game.me.getCards('h')[i].nature;
                            lib.config.wjms.card.h[i].CNname=get.translation(game.me.getCards('h')[i])
                        }
                        lib.config.wjms.card.j={};
                        for(var i=0;i<game.me.getCards('j').length;i++){
                            lib.config.wjms.card.j[i]={};
                            lib.config.wjms.card.j[i].name=game.me.getCards('j')[i].name;
                            lib.config.wjms.card.j[i].suit=game.me.getCards('j')[i].suit;
                            lib.config.wjms.card.j[i].number=game.me.getCards('j')[i].number;
                            lib.config.wjms.card.j[i].nature=game.me.getCards('j')[i].nature;
                            lib.config.wjms.card.j[i].viewAs=game.me.getCards('j')[i].viewAs;
                            lib.config.wjms.card.j[i].CNname=get.translation(game.me.getCards('j')[i])
                        }
                        lib.config.wjms.status.link=game.me.isLinked();
                        lib.config.wjms.status.turn=game.me.isTurnedOver();
                        game.saveConfig('wjms',lib.config.wjms);
                        game.over(true);
                    };
                    if(game.countPlayer(function(current){return current.identity=='me'})==0){
                        game.over(false);
                    };
                },
            },
            content:{
                gameDraw:function(){
                    "step 0"
                    if(_status.brawl&&_status.brawl.noGameDraw){
                        event.finish();
                        return;
                    }else if(get.mode()=='wjms'){
                        event.finish();
                        return;
                    }
                    var end=player;
                    var numx=num;
                    do{
                        if(typeof num=='function'){
                            numx=num(player);
                        }
                        player.directgain(get.cards(numx));
                        if(player.singleHp===true&&get.mode()!='guozhan'){
                            player.doubleDraw();
                        }
                        player=player.next;
                    }
                    while(player!=end);
                    "step 1"
                    if(!_status.auto){
                        event.dialog=ui.create.dialog('是否使用手气卡？');
                        ui.create.confirm('oc');
                        event.custom.replace.confirm=function(bool){
                            _status.event.bool=bool;
                            game.resume();
                        }
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    _status.imchoosing=true;
                    event.switchToAuto=function(){
                        _status.event.bool=false;
                        game.resume();
                    }
                    game.pause();
                    "step 3"
                    _status.imchoosing=false;
                    if(event.bool){
                        if(game.changeCoin){
                            game.changeCoin(-3);
                        }
                        var hs=game.me.getCards('h');
                        game.addVideo('lose',game.me,[get.cardsInfo(hs),[],[]]);
                        for(var i=0;i<hs.length;i++){
                            hs[i].discard(false);
                        }
                        game.me.directgain(get.cards(hs.length));
                        event.goto(2);
                    }
                    else{
                        if(event.dialog) event.dialog.close();
                        if(ui.confirm) ui.confirm.close();
                        event.finish();
                    }
                },
            },
        },
        skill:{
        },
        ai:{
            get:{
                rawAttitude:function(from,to){
                    if(from==undefined||to==undefined) return 0;
                    if(from.identity==to.identity) return 5;
                    return -5;
                },
            },
        },
        translate:{
        },
    },{
        translate:'无尽',
        extension:'无尽模式',
        config:{
            info:{
                name:'无尽模式',
                clear:true,
                nopointer:true,
                frequent:true,
            },
            restart1:{
                name:"<span style='text-decoration: underline'>重置（重新开始）</span>",
                clear:true,
                frequent:true,
                onclick:function(){
                    if(confirm('是否重置无尽模式？')){
                        for(var i in lib.config.wjms){
                            if(i=='maxRound') continue;
                            delete lib.config.wjms[i];
                        };
                        game.saveConfig('wjms',lib.config.wjms);
                        alert('重置成功');
                        if(get.mode()=='wjms') game.reload();
                    };
                },
            },
            changeCharacter1:{
                name:"<span style='text-decoration: underline'>以随机武将继续游戏</span>",
                clear:true,
                frequent:true,
                onclick:function(){
                    if(confirm('是否以随机武将继续进行游戏？')){
                        var name=game.wjms_getEvent(true);
                        lib.config.wjms.character=name;
                        var maxHp=3;
                        maxHp=get.infoMaxHp(lib.character[name][2]);
                        if(lib.config.wjms.hp==Infinity){
                            lib.config.wjms.hp=maxHp;
                        }else if(maxHp==Infinity){
                            lib.config.wjms.hp=Infinity;
                        }else{
                            lib.config.wjms.hp=Math.round(maxHp*lib.config.wjms.hp/lib.config.wjms.maxHp);
                        };
                        lib.config.wjms.maxHp=maxHp;
                        game.saveConfig('wjms',lib.config.wjms);
                        _status.wjms_divs1.avatar.setBackground(lib.config.wjms.character,'character');
                        game.say1('随机到的武将为'+get.translation(name));
                    };
                },
            },
            gk_num:{
                name:'每轮可选的选项',
                init:3,
                item:{
                    1:'1',
                    2:'2',
                    3:'3',
                    4:'4',
                    5:'5',
                },
                frequent:true,
                onclick:function(bool){
                    var bool=parseInt(bool);
                    game.saveConfig('gk_num',bool,'wjms');
                    for(var i=0;i<lib.config.mode_config.wjms.gk_num;i++){
                        if(lib.config.wjms['choice'+i]==undefined){
                            lib.config.wjms['choice'+i]=game.wjms_getEvent();
                        };
                    };
                    game.saveConfig('wjms',lib.config.wjms);
                    for(var i in _status.wjms_divs){
                        ui.window.removeChild(_status.wjms_divs[i]);
                        delete _status.wjms_divs[i];
                    };
                    game.wjms_menu(lib.config.mode_config.wjms.gk_num);
                },
            },
        },
    });
},config:{},help:{},package:{
    character:{
        character:{
        },
        translate:{
        },
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[],
    },
    skill:{
        skill:{
        },
        translate:{
        },
    },
    intro:"",
    author:"洛洛异史氏乀",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}})
