game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"sp左慈",editable:false,content:function (config,pack){
	lib.element.player.hasZhuSkill=function(skill,player){//非身份模式支持主公技
		if(!this.hasSkill(skill)) return false;
		var mode=get.mode();
		/*if(mode=='four'){
			if(player&&this.side!=player.side) return false;
		}
		if(_status.mode=='purple'){
			if(player&&this.identity.slice(0,1)!=player.identity.slice(0,1)) return false;
		}*/
        if(mode='identity'){
            if(player&&this.side!=player.side) return false;
            if(this.isZhu==true) return true;
            for(var i in this.storage){
                if(mode='wjms'){
                    if(i.indexOf('zhuSkill_sphuashen')==0) return true;
                }
                if(mode='wujin'){
                    if(i.indexOf('zhuSkill_sphuashen')==0) return true;
                }
                if(i.indexOf('zhuSkill_')==0&&this.storage[i].contains(skill)) return true;
                if(i.indexOf('zhuSkill_sphuashen')==0) return true;
            }
        }
		else{
            if(i.indexOf('zhuSkill_sphuashen')==0) return true;
        }
		return false;
	};
},precontent:function (){
},help:{},config:{},package:{
    character:{
        character:{
            "sp_zuoci":["male","qun",5,["sphuashen","spxinsheng"]],
        },
        translate:{
            "sp_zuoci":"sp左慈",
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
            sphuashen:{
                unique:true,
                direct:true,
                content:function (){
                    "step 0"
                    event.count=0;
                    "step 1"
                    _status.noclearcountdown=true;
                    event.videoId=lib.status.videoId++;
                    var cards=player.storage.sphuashen.character.slice(0);
                    var skills=[];
                    var sto=player.storage.sphuashen;
                    for(var i in player.storage.sphuashen.map){
                        skills.addArray(player.storage.sphuashen.map[i]);
                    }
                    var cond='out';
                    if(event.triggername=='phaseBegin'){
                        cond='in';
                    }
                    skills.randomSort();
                    skills.sort(function(a,b){
                        return get.skillRank(b,cond)-get.skillRank(a,cond);
                    });
                    event.aiChoice=skills[0];
                    var choice='更换技能';
                    if(event.aiChoice==player.storage.sphuashen.current2||get.skillRank(event.aiChoice,cond)<1) choice='弃置化身';
                    if(player.isOnline2()){
                        player.send(function(cards,id){
                            var dialog=ui.create.dialog('是否发动【化身】？',[cards,'character']);
                            dialog.videoId=id;
                        },cards,event.videoId);
                    }
                    event.dialog=ui.create.dialog(get.prompt('sphuashen'),[cards,'character']);
                    event.dialog.videoId=event.videoId;
                    if(!event.isMine()){
                        event.dialog.style.display='none';
                    }
                    if(event.triggername=='sphuashen') event._result={control:'更换技能'};
                    else if(event.count==0) player.chooseControl('弃置化身','更换技能','cancel2');
                    else player.chooseControl('更换技能','cancel2');
                    "step 2"
                    event.control=result.control;
                    if(event.control=='cancel2'){
                        if(player.isOnline2()){
                            player.send('closeDialog',event.videoId);
                        }
                        delete _status.noclearcountdown;
                        if(!_status.noclearcountdown){
                            game.stopCountChoose();
                        }
                        event.dialog.close();
                        event.finish();return;
                    }
                    if(!event.logged){player.logSkill('sphuashen');event.logged=true}
                    var next=player.chooseButton(true).set('dialog',event.videoId);
                    if(event.control=='弃置化身'){
                        next.set('selectButton',[1,6]);
                        next.set('filterButton',function(button){
                            return button.link!=_status.event.current;
                        });
                        next.set('current',player.storage.sphuashen.current);
                        event.count=6;
                    }
                    else{
                        next.set('ai',function(button){
                            return player.storage.sphuashen.map[button.link].contains(_status.event.choice)?2.5:1+Math.random();
                        });
                        next.set('choice',event.aiChoice);
                    }
                    var prompt=event.control=='弃置化身'?'选择弃置至多两张化身':'选择要切换的化身';
                    var func=function(id,prompt){
                        var dialog=get.idDialog(id);
                        if(dialog){
                            dialog.content.childNodes[0].innerHTML=prompt;
                        }
                    }
                    if(player.isOnline2()){
                        player.send(func,event.videoId,prompt);
                    }
                    else if(event.isMine()){
                        func(event.videoId,prompt);
                    }
                    "step 3"
                    if(result.bool&&event.control!='弃置化身'){
                        event.card=result.links[0];
                        var func=function(card,id){
                            var dialog=get.idDialog(id);
                            if(dialog){
                                for(var i=0;i<dialog.buttons.length;i++){
                                    if(dialog.buttons[i].link==card){
                                        dialog.buttons[i].classList.add('selectedx');
                                    }
                                    else{
                                        dialog.buttons[i].classList.add('unselectable');
                                    }
                                }
                            }
                        }
                        if(player.isOnline2()){
                            player.send(func,event.card,event.videoId);
                        }
                        else if(event.isMine()){
                            func(event.card,event.videoId);
                        }
                        var list=player.storage.sphuashen.map[event.card].slice(0);
                        list.push('返回');
                        player.chooseControl(list).set('choice',event.aiChoice).set('ai',function(){
                            return _status.event.choice;
                        });
                    }
                    else{
                        lib.skill.sphuashen.removeHuashen(player,result.links.slice(0));
                        lib.skill.sphuashen.addHuashens(player,result.links.length);
                    }
                    "step 4"
                    if(result.control=='返回'){
                        var func=function(id){
                            var dialog=get.idDialog(id);
                            if(dialog){
                                for(var i=0;i<dialog.buttons.length;i++){
                                    dialog.buttons[i].classList.remove('selectedx');
                                    dialog.buttons[i].classList.remove('unselectable');
                                }
                            }
                        }
                        if(player.isOnline2()){
                            player.send(func,event.videoId);
                        }
                        else if(event.isMine()){
                            func(event.videoId);
                        }
                        event._result={control:'更换化身'};
                        event.goto(2);
                        return;
                    }
                    if(player.isOnline2()){
                        player.send('closeDialog',event.videoId);
                    }
                    event.dialog.close();
                    delete _status.noclearcountdown;
                    if(!_status.noclearcountdown){
                        game.stopCountChoose();
                    }
                    if(event.control=='弃置化身') return;
                    if(player.storage.sphuashen.current!=event.card){
                        player.storage.sphuashen.current=event.card;
                        game.broadcastAll(function(character,player){
                            player.sex=lib.character[character][0];
                            player.group=lib.character[character][1];
                            player.node.name.dataset.nature=get.groupnature(player.group);
                        },event.card,player);
                    }
                    var link=result.control;
                    player.storage.sphuashen.current2=link;
                    if(!player.additionalSkills.sphuashen||!player.additionalSkills.sphuashen.contains(link)){
                        //if(event.count==6){
                            player.addAdditionalSkill('sphuashen'+event.count.toString(),link);
                        //}
                        //else{
                        //    player.addAdditionalSkill('sphuashen',link,true);
                        //}
                        if(lib.skill[link].zhuSkill){
                            player.storage["zhuSkill_sphuashen"+event.count.toString()]=[];
                            player.storage["zhuSkill_sphuashen"+event.count.toString()]=link;
                            game.log(player,'技能','【'+get.translation(link)+'】','激活为主公技');
                        }
                        else{
                            player.storage["zhuSkill_sphuashen"+event.count.toString()]=[];
                            game.log(player,'技能','【'+get.translation(link)+'】','非主公技');
                        }
                        player.flashAvatar('sphuashen',event.card);
                        game.log(player,'获得技能','#g【'+get.translation(link)+'】');
                        player.popup(link);
                        player.syncStorage('sphuashen');
                        player.updateMarks('sphuashen');
                        event.count++;
                    }
                    "step 5"
                    if (event.count<6) event.goto(1);
                },
                init:function (player,skill){
                    if(!player.storage[skill]) player.storage[skill]={
                        character:[],
                        map:{},
                    }
                },
                group:"sphuashen_init",
                trigger:{
                    player:["phaseBegin","phaseEnd","sphuashen"],
                },
                filter:function (event,player,name){
                    //if(name=='phaseBegin'&&game.phaseNumber==1) return false;
                    return player.storage.sphuashen&&player.storage.sphuashen.character.length>0;
                },
                banned:["lisu","sp_xiahoudun","xushao"],
                addHuashen:function (player){
                    if(!player.storage.sphuashen) return;
                    if(!_status.characterlist){
                        if(_status.connectMode) var list=get.charactersOL();
                        else{
                            var list=[];
                            for(var i in lib.character){
                                if(lib.filter.characterDisabled2(i)||lib.filter.characterDisabled(i)) continue;
                                list.push(i);
                            }
                        }
                        game.countPlayer2(function(current){
                            list.remove(current.name);
                            list.remove(current.name1);
                            list.remove(current.name2);
                            if(current.storage.sphuashen&&current.storage.sphuashen.character) list.removeArray(current.storage.sphuashen.character)
                        });
                        _status.characterlist=list;
                    }
                    _status.characterlist.randomSort();
                    var bool=false;
                    for(var i=0;i<_status.characterlist.length;i++){
                        var name=_status.characterlist[i];
                        if(name.indexOf('zuoci')!=-1||name.indexOf('key')==0||lib.skill.sphuashen.banned.contains(name)||player.storage.sphuashen.character.contains(name)) continue;
                        var skills=lib.character[name][3];
                        for(var j=0;j<skills.length;j++){
                            var info=lib.skill[skills[j]];
                            //if(info.charlotte||(info.unique&&!info.gainable)||info.juexingji||info.limited||info.zhuSkill) skills.splice(j--,1);
                        }
                        if(skills.length){
                            player.storage.sphuashen.character.push(name);
                            player.storage.sphuashen.map[name]=skills;
                            _status.characterlist.remove(name);
                            return name;
                        }
                    }
                },
                addHuashens:function (player,num){
                    var list=[];
                    for(var i=0;i<num;i++){
                        var name=lib.skill.sphuashen.addHuashen(player);
                        if(name) list.push(name);
                    }
                    if(list.length){
                        game.log(player,'获得了',get.cnNumber(list.length)+'张','#g化身')
                        lib.skill.sphuashen.drawCharacter(player,list);
                    }
                },
                removeHuashen:function (player,links){
                    player.storage.sphuashen.character.removeArray(links);
                    _status.characterlist.addArray(links);
                    game.log(player,'移去了',get.cnNumber(links.length)+'张','#g化身')
                },
                drawCharacter:function (player,list){
                    game.broadcastAll(function(player,list){
                        if(player.isUnderControl(true)){
                            var cards=[];
                            for(var i=0;i<list.length;i++){
                                var cardname='huashen_card_'+list[i];
                                lib.card[cardname]={
                                    fullimage:true,
                                    image:'character:'+list[i]
                                }
                                lib.translate[cardname]=get.rawName2(list[i]);
                                cards.push(game.createCard(cardname,'',''));
                            }
                            player.$draw(cards,'nobroadcast');
                        }
                    },player,list);
                },
                intro:{
                    onunmark:function (storage,player){
                        _status.characterlist.addArray(storage.character);
                        storage.character=[];
                    },
                    mark:function (dialog,storage,player){
                        if(storage&&storage.current) dialog.addSmall([[storage.current],'character']);
                        if(storage&&storage.current2) dialog.add('<div><div class="skill">【'+get.translation(lib.translate[storage.current2+'_ab']||get.translation(storage.current2).slice(0,2))+'】</div><div>'+get.skillInfoTranslation(storage.current2,player)+'</div></div>');
                        if(storage&&storage.character.length){
                            if(player.isUnderControl(true)){
                                dialog.addSmall([storage.character,'character']);
                            }
                            else{
                                dialog.addText('共有'+get.cnNumber(storage.character.length)+'张“化身”');
                            }
                        }
                        else{
                            return '没有化身';
                        }
                    },
                    content:function (storage,player){
                            return '共有'+get.cnNumber(storage.character.length)+'张“化身”'
                    },
                    markcount:function (storage,player){
                        if(storage&&storage.character) return storage.character.length;
                        return 0;
                    },
                },
            },
            "sphuashen_init":{
                trigger:{
                    global:"gameDrawAfter",
                    player:"enterGame",
                },
                forced:true,
                popup:false,
                content:function (){
                    lib.skill.sphuashen.addHuashens(player,6);
                    player.syncStorage('sphuashen');
                    player.markSkill('sphuashen');
                    var next=game.createEvent('sphuashen');
                    next.player=player;
                    next._trigger=trigger;
                    next.triggername='sphuashen';
                    next.setContent(lib.skill.sphuashen.content);
                },
            },
            spxinsheng:{
                unique:true,
                trigger:{
                    global:["damageEnd","loseHpEnd","phaseDrawEnd"],
                },
                frequent:true,
                content:function (){
                    lib.skill.sphuashen.addHuashens(player,trigger.num);
                    player.syncStorage('sphuashen');
                    player.updateMarks('sphuashen');
                },
            },
        },
        translate:{
            "sp_zuoci":"sp左慈",
            sphuashen:"化身",
            "sphuashen_info":"游戏开始后，你随机获得6张未加入游戏的武将牌，选6个技能置于你面前并声明，你拥有这些技能且同时将性别和势力属性变成与最后一个技能武将相同直到该化身被替换。你的每个准备阶段和结束后，你可以选择一项：①弃置至多六张未展示的化身牌并重新获得等量化身牌；②更换所展示的化身牌或技能。",
            spxinsheng:"新生",
            "spxinsheng_info":"任何角色每受到1点伤害、流失1点体力或摸一张牌后，你可以获得一张新的化身牌。",
        },
    },
    intro:"",
    author:"czy",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["sp_zuoci.jpg"],"card":[],"skill":[]}}})
