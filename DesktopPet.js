/*
 * Project: 
 *                eSheep - Webpage
 * 
 * Date:    
 *                20.april 2016
 * 
 * Author:
 *                Adriano Petrucci (http://esheep.petrucci.ch)
 * 
 * Version:       0.5
 * 
 * Introduction:
 *                As "wrapper" for the OpenSource C# project
 *                (see https://github.com/Adrianotiger/desktopPet), 
 *                this javascript "class" was written to get the animations also inside your
 *                webpage. It doesn't work like the Windows version, but show much animations from it.
 * 
 * Description:
 *                Add a walking pet (sheep to your home page) with just a few lines of code!
 *                Will add a lovely sheep (stray sheep) and this will walk around your page and over
 *                all <hr>s and <div>s with a border. You can also select another animation, using your 
 *                personal XML file or one from the database.
 * 
 * How to use:    
 *                Add this line in your <header>:
 *                <script src="http://esheep.petrucci.ch/script/DesktopPet.js"></script>
 *                Add this lines in your <body> (at the end if possible):
 *                <script>
                    var pet = new DesktopPet();
                    pet.start_esheep('http://esheep.petrucci.ch/script/animation.xml');
                  </script>
 *                That's all!
 * 
 * Requirement:   
 *                Tested on IE11, Edge and Opera 
 * 
 * Changelog:
 *                Version 0.5 - 12.07.2017:
 *                  - animations starts only once the image was loaded (thanks RedSparr0w)
 *                Version 0.x:
 *                  - still beta versions...
 */

var DesktopPetVersion = '0.5';

function DesktopPet()
{
var _esheep = this;

this.DOMdiv = document.createElement("div");
this.DOMimg = document.createElement("img");
this.DOMdebug = document.createElement("div");
this.DOMinfo = document.createElement("div");

this.parser = new DOMParser();
this.xmlDoc = null;

this.tilesX = 1;
this.tilesY = 1;
this.imageW = 1;
this.imageH = 1;
this.imageX = 1;
this.imageY = 1;
this.flipped = false;
this.dragging = false;
this.infobox = false;
this.animationId = 0;
this.animationStep = 0;
this.animationNode = null;
this.sprite = new Image();
this.HTMLelement = null;
this.randS = Math.random() * 100;

this.screenW = window.innerWidth
              || document.documentElement.clientWidth
              || document.body.clientWidth;

this.screenH = window.innerHeight
              || document.documentElement.clientHeight
              || document.body.clientHeight;

this.parseXML = function(text)
{
  this.xmlDoc = this.parser.parseFromString(text,'text/xml');
  var image = this.xmlDoc.getElementsByTagName('image')[0]; 
  this.tilesX = image.getElementsByTagName("tilesx")[0].textContent;
  this.tilesY = image.getElementsByTagName("tilesy")[0].textContent;
  //this.sprite.src = 'data:image/png;base64,data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==';
  this.sprite.onload = function () 
  {
    //alert("image is loaded");
    var attribute = 
    "width:" + (_esheep.sprite.width) + "px;" +
    "height:" + (_esheep.sprite.height) + "px;" +
    "position:absolute;" + 
    "top:0px;" + 
    "left:0px;";
    _esheep.DOMimg.setAttribute("style", attribute);
    _esheep.DOMimg.ondragstart = function() { return false; };
    _esheep.imageW = _esheep.sprite.width / _esheep.tilesX;
    _esheep.imageH = _esheep.sprite.height / _esheep.tilesY;
    _esheep.imageX = 0;
    _esheep.imageY = _esheep.screenH - _esheep.sprite.height / _esheep.tilesY;
    //for(var i=0;i<5000;i++) if(_esheep.sprite.width != 0) break;
    attribute = 
      "width:" + (_esheep.imageW) + "px;" +
      "height:" + (_esheep.imageH) + "px;" +
      "position:fixed;" + 
      "top:" + (_esheep.imageY) + "px;" + 
      "left:" + (_esheep.imageX) + "px;" + 
      "transform:rotatey(0deg);" +
      "cursor:move;" +
      "z-index:2000;" +
      "overflow:hidden;"; 
    _esheep.DOMdiv.setAttribute("style", attribute);
    _esheep.DOMdiv.appendChild(_esheep.DOMimg);
  }

  this.sprite.src = 'data:image/png;base64,' + image.getElementsByTagName("png")[0].textContent;
  this.DOMimg.setAttribute("src", this.sprite.src);
  
  this.DOMdiv.onmousemove = function(e) {
    if(!_esheep.dragging && e.buttons==1 && e.button==0)
    {
    _esheep.dragging = true;
    _esheep.HTMLelement = null;
    var childsRoot = _esheep.xmlDoc.getElementsByTagName('animations')[0];
    var childs = childsRoot.getElementsByTagName('animation');
    for(k=0;k<childs.length;k++)
    {
      if(childs[k].getElementsByTagName('name')[0].textContent == "drag")
      {
        _esheep.animationId = childs[k].getAttribute("id");
        _esheep.animationStep = 0;
        _esheep.animationNode = childs[k];
        break;
      }
    }
    }
  };
  document.body.onmousemove = function(e) {
    if(_esheep.dragging)
    {
      _esheep.imageX = parseInt(e.clientX) - _esheep.imageW/2;
      _esheep.imageY = parseInt(e.clientY) - _esheep.imageH/2;
      _esheep.DOMdiv.style.left = _esheep.imageX + "px";
      _esheep.DOMdiv.style.top = _esheep.imageY + "px";
    }
  };
  document.body.onresize = function(e) {
    _esheep.screenW = window.innerWidth
              || document.documentElement.clientWidth
              || document.body.clientWidth;

    _esheep.screenH = window.innerHeight
              || document.documentElement.clientHeight
              || document.body.clientHeight;
              
    if(_esheep.imageY + _esheep.imageH > _esheep.screenH)
    {
      _esheep.imageY = _esheep.screenH - _esheep.imageH;
      _esheep.DOMdiv.style.top = _esheep.imageY + "px";
    }
    if(_esheep.imageX + _esheep.imageW > _esheep.screenW)
    {
      _esheep.imageX = _esheep.screenW - _esheep.imageW;
      _esheep.DOMdiv.style.left = _esheep.imageX + "px";
    }
  }
  this.DOMdiv.onmouseup = function(e) {
    if(_esheep.dragging)
    {
      _esheep.dragging = false;
    }
    else if(_esheep.infobox)
    {
      _esheep.DOMinfo.style.display = "none";
      _esheep.infobox = false;
    }
    else
    {
      _esheep.DOMinfo.style.left = Math.min(_esheep.screenW-200, Math.max(0, parseInt(_esheep.imageX + _esheep.imageW/2 - parseInt(_esheep.DOMinfo.style.width)/2))) + "px";
      _esheep.DOMinfo.style.top = parseInt(_esheep.imageY - parseInt(_esheep.DOMinfo.style.height)) + "px";
      _esheep.DOMinfo.style.display = "block";
      _esheep.infobox = true;
    }
  };
  this.DOMinfo.onmouseup = function(e) {
    _esheep.DOMinfo.style.display = "none";
    _esheep.infobox = false;
  };
  attribute = 
    "width:200px;" +
    "height:200px;" +
    "position:fixed;" + 
    "top:100px;left:10px;" + 
    "border-width:2px;" + 
    "overflow:auto;background-color:lightgray;";
  this.DOMdebug.setAttribute("style",attribute);
  //document.body.appendChild(this.DOMdebug);
  attribute = 
    "width:200px;" +
    "height:100px;" +
    "position:fixed;" + 
    "top:100px;left:10px;" + 
    "display:none;" +
    "border-width:2px;" + 
    "border-radius:5px;" + 
    "border-style:ridge;" +
    "text-align:center;" +
    "color:black;" +
    "opacity:0.9;" + 
    "z-index:9999;" +
    "overflow:auto;background-color:lightblue;";
  this.DOMinfo.setAttribute("style",attribute);
  this.DOMinfo.innerHTML = "<b>eSheep</b><sup style='float:right;'>ver: " + DesktopPetVersion + "</sup><br><hr>Visit the home page of this lovely sheep:<br><a href='http://esheep.petrucci.ch' target='_blank'>http://esheep.petrucci.ch</a>";
  document.body.appendChild(this.DOMinfo);
  document.body.appendChild(this.DOMdiv);
};

this.setPosition = function(x, y, absolute)
{
  if(absolute)
  {      
    this.imageX = x;
    this.imageY = y;
  }
  else
  {
    this.imageX = parseInt(this.imageX) + parseInt(x);
    this.imageY = parseInt(this.imageY) + parseInt(y);
  }
  
  this.DOMdiv.style.left = this.imageX + "px";
  this.DOMdiv.style.top = this.imageY + "px"; 
}

this.start_esheep = function(animation)
{
  animation = typeof animation !== 'undefined' ? animation : "./Animation.html";

  ajax = new XMLHttpRequest();
      
  ajax.open("GET", animation, true);
  ajax.onreadystatechange = function()
  {
    if(this.readyState == 4)
    {
      if(this.status == 200){
        _esheep.parseXML(this.responseText);
        _esheep.spawn_esheep();
      }
      else{
        alert("XML not available:" + this.statusText);
      }
    }
  }
  ajax.send(null);
}

this.spawn_esheep = function()
{
  var spawnsRoot = _esheep.xmlDoc.getElementsByTagName('spawns')[0];
  var spawns = spawnsRoot.getElementsByTagName('spawn');
  var prob = 0;
  for(i=0;i<spawns.length;i++)
    prob += parseInt(spawns[0].getAttribute("probability"));
  var rand = Math.random() * prob;
  prob = 0;
  for(i=0;i<spawns.length;i++)
  {
    prob += parseInt(spawns[i].getAttribute("probability"));
    if(prob >= rand)
    {
      _esheep.setPosition(
        _esheep.parseKeyWords(spawns[i].getElementsByTagName('x')[0].textContent), 
        _esheep.parseKeyWords(spawns[i].getElementsByTagName('y')[0].textContent),
        true
      ); 
      _esheep.animationId = spawns[i].getElementsByTagName('next')[0].textContent;
      _esheep.animationStep = 0;
      var childsRoot = _esheep.xmlDoc.getElementsByTagName('animations')[0];
      var childs = childsRoot.getElementsByTagName('animation');
      for(k=0;k<childs.length;k++)
      {
        if(childs[k].getAttribute("id") == _esheep.animationId)
        {
          _esheep.animationNode = childs[k];
          break;
        }
      }
      break;
    }
  }
  _esheep.next_esheep();
}

this.parseKeyWords = function(value)
{
  value = value.replace(/screenW/g, _esheep.screenW); 
  value = value.replace(/screenH/g, _esheep.screenH); 
  value = value.replace(/areaW/g, _esheep.screenH); 
  value = value.replace(/areaH/g, _esheep.screenH); 
  value = value.replace(/imageW/g, _esheep.imageW); 
  value = value.replace(/imageH/g, _esheep.imageH); 
  value = value.replace(/random/g, Math.random()*100);
  value = value.replace(/randS/g, _esheep.randS);
  return eval(value);
}

this.getNodeValue = function(nodeName, valueName, defaultValue)
{
  if(!_esheep.animationNode || !_esheep.animationNode.getElementsByTagName(nodeName)) return;
  if(_esheep.animationNode.getElementsByTagName(nodeName)[0].getElementsByTagName(valueName)[0])
  {
    var value = _esheep.animationNode.getElementsByTagName(nodeName)[0].getElementsByTagName(valueName)[0].textContent;
      
    return _esheep.parseKeyWords(value);
  }
  else
  {
    return defaultValue;
  }
}

this.getNextRandomNode = function(parentNode)
{
  var baseNode = parentNode.getElementsByTagName('next');
  var childsRoot = _esheep.xmlDoc.getElementsByTagName('animations')[0];
  var childs = childsRoot.getElementsByTagName('animation');
  var prob = 0;
  
  if(baseNode.length == 0)
  {
    _esheep.spawn_esheep();
    return false;
  }
      
  for(k=0;k<baseNode.length;k++)
  {
    prob += parseInt(baseNode[k].getAttribute("probability"));
  }
  var rand = Math.random() * prob;
  var index = 0;
  prob = 0;
  for(k=0;k<baseNode.length;k++)
  {
    prob += parseInt(baseNode[k].getAttribute("probability"));
    if(prob >= rand)
    {
      index = k;
      break;
    }
  }
  for(k=0;k<childs.length;k++)
  {
    if(childs[k].getAttribute("id") == baseNode[index].textContent)
    {
      _esheep.animationId = childs[k].getAttribute("id");
      _esheep.animationStep = 0;
      _esheep.animationNode = childs[k];
      return true;
    }
  }
  return false;
}

this.checkOverlapping = function()
{
  var divs = document.body.getElementsByTagName('div');
  var hrs = document.body.getElementsByTagName('hr');
  
  var x = _esheep.imageX;
  var y = _esheep.imageY + _esheep.imageH;
  var rect;
  var margin = 20;
  if(_esheep.HTMLelement) margin = 5;
  for(i=0;i<divs.length;i++)
  {
    rect = divs[i].getBoundingClientRect();

    if(y > rect.top - 2 && y < rect.top + margin)
    {
      if(x > rect.left && x < rect.right - _esheep.imageW)
      {
        var style = window.getComputedStyle(divs[i]);
        if((style.borderTopStyle != "" && style.borderTopStyle != "none") && style.display != "none")
        {
          return divs[i];
        }
      }
    }
  }
  for(i=0;i<hrs.length;i++)
  {
    rect = hrs[i].getBoundingClientRect();

    if(y > rect.top - 2 && y < rect.top + margin)
    {
      if(x > rect.left && x < rect.right - _esheep.imageW)
      {
        return hrs[i];
      }
    }
  }
  return false;
}
  
this.next_esheep = function()
{
  var x1 = _esheep.getNodeValue('start','x',0);
  var y1 = _esheep.getNodeValue('start','y',0);
  var off1 = _esheep.getNodeValue('start','offsety',0);
  var opa1 = _esheep.getNodeValue('start','opacity',1);
  var del1 = _esheep.getNodeValue('start','interval',1000);
  var x2 = _esheep.getNodeValue('end','x',0);
  var y2 = _esheep.getNodeValue('end','y',0);
  var off2 = _esheep.getNodeValue('end','offsety',0);
  var opa2 = _esheep.getNodeValue('end','interval',1);
  var del2 = _esheep.getNodeValue('end','interval',1000);
  
  var repeat = _esheep.parseKeyWords(_esheep.animationNode.getElementsByTagName('sequence')[0].getAttribute('repeat'));
  var repeatfrom = _esheep.animationNode.getElementsByTagName('sequence')[0].getAttribute('repeatfrom');
  var gravity = _esheep.animationNode.getElementsByTagName('gravity');
  var border = _esheep.animationNode.getElementsByTagName('border');
  
  var steps = _esheep.animationNode.getElementsByTagName('frame').length + 
              (_esheep.animationNode.getElementsByTagName('frame').length - repeatfrom) * repeat;
    
  var index;
  
  if(_esheep.animationStep < _esheep.animationNode.getElementsByTagName('frame').length)
    index = _esheep.animationNode.getElementsByTagName('frame')[_esheep.animationStep].textContent;
  else if(repeatfrom == 0)
    index = _esheep.animationNode.getElementsByTagName('frame')[_esheep.animationStep % _esheep.animationNode.getElementsByTagName('frame').length].textContent;
  else 
    index = _esheep.animationNode.getElementsByTagName('frame')[parseInt(repeatfrom) + parseInt((_esheep.animationStep - repeatfrom) % (_esheep.animationNode.getElementsByTagName('frame').length - repeatfrom))].textContent;
  
  _esheep.DOMimg.style.left = (- _esheep.imageW * (index % _esheep.tilesX)) + "px";
  _esheep.DOMimg.style.top = (- _esheep.imageH * parseInt(index / _esheep.tilesX)) + "px";
  
  if(_esheep.dragging || _esheep.infobox)
  {
    _esheep.animationStep++;
    window.setTimeout(_esheep.next_esheep, 50);
    return;    
  } 
   
  if(_esheep.flipped)
  {
    x1 = -x1;
    x2 = -x2;
  } 
    
  if(_esheep.animationStep == 0)
    _esheep.setPosition(x1, y1, false);
  else
    _esheep.setPosition(
                        parseInt(x1) + parseInt((x2-x1)*_esheep.animationStep/steps), 
                        parseInt(y1) + parseInt((y2-y1)*_esheep.animationStep/steps), 
                        false);
  
  _esheep.animationStep++;
      
  if(_esheep.animationStep >= steps)
  {
    if(_esheep.animationNode.getElementsByTagName('action')[0])
    {
      switch(_esheep.animationNode.getElementsByTagName('action')[0].textContent)
      {
        case "flip":
          if(_esheep.DOMdiv.style.transform == "rotateY(0deg)")
          {
            _esheep.DOMdiv.style.transform = "rotateY(180deg)";
            _esheep.flipped = true;
          }
          else
          {
            _esheep.DOMdiv.style.transform = "rotateY(0deg)";
            _esheep.flipped = false;
          }
          break;
        default:
          
          break;
      } 
    }
    if(!_esheep.getNextRandomNode(_esheep.animationNode.getElementsByTagName('sequence')[0])) return;
  }
  
  var setNext = false;
  
  if(border && border[0] && border[0].getElementsByTagName('next'))
  {
    if(x2<0 && _esheep.imageX < 0)
    {
      _esheep.imageX = 0;
      setNext = true;
    }
    else if(x2 > 0 && _esheep.imageX > _esheep.screenW - _esheep.imageW)
    {
      _esheep.imageX = _esheep.screenW - _esheep.imageW;
      _esheep.DOMdiv.style.left = parseInt(_esheep.imageX) + "px";
      setNext = true;
    }
    else if(y2 < 0 && _esheep.imageY < 0)
    {
      _esheep.imageY = 0;
      setNext = true;
    }
    else if(y2 > 0 && _esheep.imageY > _esheep.screenH - _esheep.imageH)
    {
      _esheep.imageY = _esheep.screenH - _esheep.imageH;
      setNext = true;
    }
    else if(y2 > 0)
    {
      if(_esheep.checkOverlapping())
      {
        if(_esheep.imageY > _esheep.imageH)
        {
          _esheep.HTMLelement = _esheep.checkOverlapping();
          _esheep.imageY = _esheep.HTMLelement.getBoundingClientRect().top - _esheep.imageH;
          setNext = true;
        }
      }
    }
    else if(_esheep.HTMLelement)
    {
      if(!_esheep.checkOverlapping())
      {
        if(_esheep.imageY + _esheep.imageH > _esheep.HTMLelement.getBoundingClientRect().top + 3 ||
           _esheep.imageY + _esheep.imageH < _esheep.HTMLelement.getBoundingClientRect().top - 3)
        {
          _esheep.HTMLelement = null;
        }
        else if(_esheep.imageX < _esheep.HTMLelement.getBoundingClientRect().left)
        {
          _esheep.imageX = parseInt(_esheep.imageX + 3);
          setNext = true;
        }
        else
        {
          _esheep.imageX = parseInt(_esheep.imageX - 3);
          setNext = true;
        }
        _esheep.DOMdiv.style.left = parseInt(_esheep.imageX) + "px";
      }
    }
    if(setNext)
    {
      if(!_esheep.getNextRandomNode(border[0])) return;
    }
  }
  if(!setNext && gravity && gravity[0] && gravity[0].getElementsByTagName('next'))
  {
    if(_esheep.imageY < _esheep.screenH - _esheep.imageH - 2)
    {
      if(_esheep.HTMLelement == null)
      {
        setNext = true;
      }
      else
      {
        if(!_esheep.checkOverlapping())
        {
          setNext = true;
          _esheep.HTMLelement = null;
        }
      }
      
      if(setNext)
      {
        if(!_esheep.getNextRandomNode(gravity[0])) return;
      }
    }
  }
  if(!setNext)
  {
    if(_esheep.imageX < - _esheep.imageW && x2 < 0 || 
      _esheep.imageX > _esheep.screenW && x2 > 0 ||
      _esheep.imageY < - _esheep.imageH && y1 < 0 ||
      _esheep.imageY > _esheep.screenH && y2 > 0)
    {
      setNext = true;
      _esheep.spawn_esheep();
      return; 
    }
  }
  
  window.setTimeout(_esheep.next_esheep, (parseInt(del1) + parseInt((del2-del1)*_esheep.animationStep/steps)));             
}
};











