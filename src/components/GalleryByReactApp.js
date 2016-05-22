require('normalize.css/normalize.css');
require('../styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关的数据
let imageDatas = require('../sources/imageDatas.json');

// 利用自执行函数，将图片信息转换成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
	for (let i = 0, j = imageDatasArr.length; i < j; i++) {
		let singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

/**
 * 获取区间内的一个随机数值
 * @param  {Number} min    最小值
 * @param  {Number} max 最大值
 * @return {Number} 返回一个随机值
 */
function getRangeRandom(min, max){
	return Math.ceil(Math.random() * (max - min) + min);
}
/**
 * 获取0-30度之间的任意征服值
 * @return {[Number]} 0-30度之间的任意角度
 */
function get30DegRandom(){
	return (Math.random() > 0.5?'':'-') + Math.ceil(Math.random() * 30)
}

var ImgFigure = React.createClass({
	/**
	 * imgfigure的点击处理函数
	 * @return {[type]} [description]
	 */
	handleClick:function(e){
		e.stopPropagation();
		e.preventDefault();

		if(this.props.arrange.isCenter){
			this.props.inverse()
		}else{
			this.props.center()
		}

	},
	render: function(){

		var styleObj = {};
		// 如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		if(this.props.arrange.rotate){
			(['MozTransform','msTransform','WebitTransform','transform']).forEach(function(value){
			styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}

		var imgFigureClassName = 'img-figure';
			imgFigureClassName += (this.props.arrange.isInverse ?' is-inverse': '');

		return(
			<figure data-index={this.props.index} className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL}
						 alt={this.props.data.title}
				/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back"  onClick={this.handleClick}>
						<p>{this.props.data.desc}</p>
					</div>
				</figcaption>
			</figure>
		)
	}
})

var ControllerUnit = React.createClass({
	handleClick:function(e){
		e.stopPropagation();
		e.preventDefault();

		// 如果点击的是当前选中的按钮，则翻转图片，否则将对应的图片居中
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center()
		}
	},
	render: function(){
		var controllerUnitClassName = 'controller-unit';

		// 如果对应的是居中的图片，显示控制按钮的居中态
		if(this.props.arrange.isCenter){
			controllerUnitClassName += ' is-center';

			// 如果同时对应的是翻转图片，显示控制按钮的翻转态
			if(this.props.arrange.isInverse){
				controllerUnitClassName += ' is-inverse';
			}
		}

		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		)
	}
})

var GalleryByReactApp = React.createClass({
	Constant:{
		centerPos:{
			left:0,
			right:0,
			zIndex:999
		},
		// 水平方向的取值范围
		hPosRange:{
			leftSecX:[0,0], // 左分区的取值范围
			rightSecX:[0,0], // 右分区的取值范围
			y:[0,0] // Y轴上的取值范围
		},
		// 垂直方向的取值范围
		vPosRange:{
			x:[0,0],
			topY:[0,0]
		}
	},
	/**
	 * 翻转图片
	 * @param index 输入当前被执行inverse操作图片对应的图片信息数组的index值
	 * @return {Function} 这是一个闭包函数, 其内return一个真正被执行的函数
	 */
	inverse: function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		}.bind(this);
	},
	/*
	 * 重新布局所有图片
	 * @parma centerIndex
	 */
	reArrange:function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			vPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random()* 2), // 取一个或者不取
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

			console.log(centerPos)
			// 首先居中centerIndex的图片,居中centerIndex的图片不需要旋转
			imgsArrangeCenterArr[0] = {
				pos:centerPos,
				rotate:0,
				isCenter:true
			}

			console.log(imgsArrangeCenterArr[0].pos)
			// 取出要布局上侧图片的状态信息
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			// 布局位于上侧的图片
			imgsArrangeTopArr.forEach(function(value, index){
				imgsArrangeTopArr[index] = {
					pos:{
						top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate:get30DegRandom(),
					isCenter: false
				}
			});

			//布局左右两侧的图片
			for(var i = 0,j = imgsArrangeArr.length, k = j / 2;i < j; i++){
				var hPosRangeLorR = null;
				// 前部分布局左边， 有半部分布局左边
				if(i < k){
					hPosRangeLorR = hPosRangeLeftSecX;
				}else{
					hPosRangeLorR = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] ={
					pos:{
						top: getRangeRandom(vPosRangeY[0],vPosRangeY[1]),
						left: getRangeRandom(hPosRangeLorR[0],hPosRangeLorR[1])
					},
					rotate:get30DegRandom(),
					isCenter: false
				}
			}

			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
			}
			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0])

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
	},

	/**
	 * liyong reArrange函数， 居中对应的index图片
	 * @param {index}, 需要被居中的图片对应的图片信息数组的index
	 * @return {Function}
	 */
	center: function(index){
		return function(){
			this.reArrange(index)
		}.bind(this)
	},
	getInitialState: function(){
		return {
			imgsArrangeArr:[
				/*{
					pos:{
						left:0,
						top:0
					},
					rotate:0, //旋转角度
					isInverse: true, //图片正反面
					isCenter: false, //图片是否居中默认不居中
				}*/
			]
		}
	},

	// 组件加载后，为每张图片计算其位置的范围
	componentDidMount: function(){
		// 获取到舞台的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth, // 舞台宽度
			stageH = stageDOM.scrollHeight, // 舞台高度
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		// 获取到第一个imgeFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
		var imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// 计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH,
			zIndex:1, // 解决居中图片始终在上层
		}

		// 	计算左侧，右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgH;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		// 计算上册区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		this.reArrange(0);
	},
	render() {
		var controllerUnits = [],
			imgFigures = [];

		imageDatas.forEach(function(value, index){
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse: true,
					isCenter: false
				}
			}

			imgFigures.push(<ImgFigure index={index} key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />)
			controllerUnits.push(<ControllerUnit index={index} key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />)
		}.bind(this));

		return (
			<section className="stage" ref="stage">
				<section className="img-src">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
})

module.exports = GalleryByReactApp;
