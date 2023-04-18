from typing import Any, Union

class AtriStyles:
	def __init__(self, state: Union[Any, None]):
		self._setter_access_tracker = {}
		self._getter_access_tracker = {}
		self._state_is_none = state == None

		self.display: Union[str, None] = state["display"] if state != None and "display" in state else None
		self.flexDirection: Union[str, None] = state["flexDirection"] if state != None and "flexDirection" in state else None
		self.alignItems: Union[str, None] = state["alignItems"] if state != None and "alignItems" in state else None
		self.justifyContent: Union[str, None] = state["justifyContent"] if state != None and "justifyContent" in state else None
		self.flexWrap: Union[str, None] = state["flexWrap"] if state != None and "flexWrap" in state else None
		self.alignContent: Union[str, None] = state["alignContent"] if state != None and "alignContent" in state else None
		self.rowGap: Union[str, None] = state["rowGap"] if state != None and "rowGap" in state else None
		self.columnGap: Union[str, None] = state["columnGap"] if state != None and "columnGap" in state else None
		self.alignSelf: Union[str, None] = state["alignSelf"] if state != None and "alignSelf" in state else None
		self.flexGrow: Union[str, None] = state["flexGrow"] if state != None and "flexGrow" in state else None
		self.flexShrink: Union[str, None] = state["flexShrink"] if state != None and "flexShrink" in state else None
		self.order: Union[str, None] = state["order"] if state != None and "order" in state else None
		self.marginTop: Union[str, None] = state["marginTop"] if state != None and "marginTop" in state else None
		self.marginBottom: Union[str, None] = state["marginBottom"] if state != None and "marginBottom" in state else None
		self.marginRight: Union[str, None] = state["marginRight"] if state != None and "marginRight" in state else None
		self.marginLeft: Union[str, None] = state["marginLeft"] if state != None and "marginLeft" in state else None
		self.paddingTop: Union[str, None] = state["paddingTop"] if state != None and "paddingTop" in state else None
		self.paddingBottom: Union[str, None] = state["paddingBottom"] if state != None and "paddingBottom" in state else None
		self.paddingRight: Union[str, None] = state["paddingRight"] if state != None and "paddingRight" in state else None
		self.paddingLeft: Union[str, None] = state["paddingLeft"] if state != None and "paddingLeft" in state else None
		self.width: Union[str, None] = state["width"] if state != None and "width" in state else None
		self.height: Union[str, None] = state["height"] if state != None and "height" in state else None
		self.minWidth: Union[str, None] = state["minWidth"] if state != None and "minWidth" in state else None
		self.minHeight: Union[str, None] = state["minHeight"] if state != None and "minHeight" in state else None
		self.maxWidth: Union[str, None] = state["maxWidth"] if state != None and "maxWidth" in state else None
		self.maxHeight: Union[str, None] = state["maxHeight"] if state != None and "maxHeight" in state else None
		self.overflow: Union[str, None] = state["overflow"] if state != None and "overflow" in state else None
		self.fontFamily: Union[str, None] = state["fontFamily"] if state != None and "fontFamily" in state else None
		self.fontWeight: Union[str, None] = state["fontWeight"] if state != None and "fontWeight" in state else None
		self.fontSize: Union[str, None] = state["fontSize"] if state != None and "fontSize" in state else None
		self.textAlign: Union[str, None] = state["textAlign"] if state != None and "textAlign" in state else None
		self.color: Union[str, None] = state["color"] if state != None and "color" in state else None
		self.opacity: Union[str, None] = state["opacity"] if state != None and "opacity" in state else None
		self.fontStyle: Union[str, None] = state["fontStyle"] if state != None and "fontStyle" in state else None
		self.borderRadius: Union[str, None] = state["borderRadius"] if state != None and "borderRadius" in state else None
		self.borderWidth: Union[str, None] = state["borderWidth"] if state != None and "borderWidth" in state else None
		self.borderStyle: Union[str, None] = state["borderStyle"] if state != None and "borderStyle" in state else None
		self.borderColor: Union[str, None] = state["borderColor"] if state != None and "borderColor" in state else None
		self.backgroundImage: Union[str, None] = state["backgroundImage"] if state != None and "backgroundImage" in state else None
		self.backgroundColor: Union[str, None] = state["backgroundColor"] if state != None and "backgroundColor" in state else None
		self.backgroundClip: Union[str, None] = state["backgroundClip"] if state != None and "backgroundClip" in state else None
		self.backgroundOrigin: Union[str, None] = state["backgroundOrigin"] if state != None and "backgroundOrigin" in state else None
		self.backgroundAttachment: Union[str, None] = state["backgroundAttachment"] if state != None and "backgroundAttachment" in state else None
		self.backgroundPositionX: Union[str, None] = state["backgroundPositionX"] if state != None and "backgroundPositionX" in state else None
		self.backgroundPositionY: Union[str, None] = state["backgroundPositionY"] if state != None and "backgroundPositionY" in state else None
		self.backgroundRepeat: Union[str, None] = state["backgroundRepeat"] if state != None and "backgroundRepeat" in state else None
		self.position: Union[str, None] = state["position"] if state != None and "position" in state else None
		self.float: Union[str, None] = state["float"] if state != None and "float" in state else None
		self.clear: Union[str, None] = state["clear"] if state != None and "clear" in state else None
		self.top: Union[str, None] = state["top"] if state != None and "top" in state else None
		self.left: Union[str, None] = state["left"] if state != None and "left" in state else None
		self.bottom: Union[str, None] = state["bottom"] if state != None and "bottom" in state else None
		self.right: Union[str, None] = state["right"] if state != None and "right" in state else None
		self.zIndex: Union[str, None] = state["zIndex"] if state != None and "zIndex" in state else None
		self.outlineStyle: Union[str, None] = state["outlineStyle"] if state != None and "outlineStyle" in state else None
		self.outlineColor: Union[str, None] = state["outlineColor"] if state != None and "outlineColor" in state else None
		self.outlineOffset: Union[str, None] = state["outlineOffset"] if state != None and "outlineOffset" in state else None
		self.outlineWidth: Union[str, None] = state["outlineWidth"] if state != None and "outlineWidth" in state else None
		self.cursor: Union[str, None] = state["cursor"] if state != None and "cursor" in state else None
		self.boxSizing: Union[str, None] = state["boxSizing"] if state != None and "boxSizing" in state else None
		
		self._setter_access_tracker = {}
		self._getter_access_tracker = {}

	@property
	def display(self):
		self._getter_access_tracker["display"] = {}
		return self._display
	@display.setter
	def display(self, state):
		self._setter_access_tracker["display"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._display = state
	@property
	def flexDirection(self):
		self._getter_access_tracker["flexDirection"] = {}
		return self._flexDirection
	@flexDirection.setter
	def flexDirection(self, state):
		self._setter_access_tracker["flexDirection"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._flexDirection = state
	@property
	def alignItems(self):
		self._getter_access_tracker["alignItems"] = {}
		return self._alignItems
	@alignItems.setter
	def alignItems(self, state):
		self._setter_access_tracker["alignItems"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._alignItems = state
	@property
	def justifyContent(self):
		self._getter_access_tracker["justifyContent"] = {}
		return self._justifyContent
	@justifyContent.setter
	def justifyContent(self, state):
		self._setter_access_tracker["justifyContent"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._justifyContent = state
	@property
	def flexWrap(self):
		self._getter_access_tracker["flexWrap"] = {}
		return self._flexWrap
	@flexWrap.setter
	def flexWrap(self, state):
		self._setter_access_tracker["flexWrap"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._flexWrap = state
	@property
	def alignContent(self):
		self._getter_access_tracker["alignContent"] = {}
		return self._alignContent
	@alignContent.setter
	def alignContent(self, state):
		self._setter_access_tracker["alignContent"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._alignContent = state
	@property
	def rowGap(self):
		self._getter_access_tracker["rowGap"] = {}
		return self._rowGap
	@rowGap.setter
	def rowGap(self, state):
		self._setter_access_tracker["rowGap"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._rowGap = state
	@property
	def columnGap(self):
		self._getter_access_tracker["columnGap"] = {}
		return self._columnGap
	@columnGap.setter
	def columnGap(self, state):
		self._setter_access_tracker["columnGap"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._columnGap = state
	@property
	def alignSelf(self):
		self._getter_access_tracker["alignSelf"] = {}
		return self._alignSelf
	@alignSelf.setter
	def alignSelf(self, state):
		self._setter_access_tracker["alignSelf"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._alignSelf = state
	@property
	def flexGrow(self):
		self._getter_access_tracker["flexGrow"] = {}
		return self._flexGrow
	@flexGrow.setter
	def flexGrow(self, state):
		self._setter_access_tracker["flexGrow"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._flexGrow = state
	@property
	def flexShrink(self):
		self._getter_access_tracker["flexShrink"] = {}
		return self._flexShrink
	@flexShrink.setter
	def flexShrink(self, state):
		self._setter_access_tracker["flexShrink"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._flexShrink = state
	@property
	def order(self):
		self._getter_access_tracker["order"] = {}
		return self._order
	@order.setter
	def order(self, state):
		self._setter_access_tracker["order"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._order = state
	@property
	def marginTop(self):
		self._getter_access_tracker["marginTop"] = {}
		return self._marginTop
	@marginTop.setter
	def marginTop(self, state):
		self._setter_access_tracker["marginTop"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._marginTop = state
	@property
	def marginBottom(self):
		self._getter_access_tracker["marginBottom"] = {}
		return self._marginBottom
	@marginBottom.setter
	def marginBottom(self, state):
		self._setter_access_tracker["marginBottom"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._marginBottom = state
	@property
	def marginRight(self):
		self._getter_access_tracker["marginRight"] = {}
		return self._marginRight
	@marginRight.setter
	def marginRight(self, state):
		self._setter_access_tracker["marginRight"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._marginRight = state
	@property
	def marginLeft(self):
		self._getter_access_tracker["marginLeft"] = {}
		return self._marginLeft
	@marginLeft.setter
	def marginLeft(self, state):
		self._setter_access_tracker["marginLeft"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._marginLeft = state
	@property
	def paddingTop(self):
		self._getter_access_tracker["paddingTop"] = {}
		return self._paddingTop
	@paddingTop.setter
	def paddingTop(self, state):
		self._setter_access_tracker["paddingTop"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._paddingTop = state
	@property
	def paddingBottom(self):
		self._getter_access_tracker["paddingBottom"] = {}
		return self._paddingBottom
	@paddingBottom.setter
	def paddingBottom(self, state):
		self._setter_access_tracker["paddingBottom"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._paddingBottom = state
	@property
	def paddingRight(self):
		self._getter_access_tracker["paddingRight"] = {}
		return self._paddingRight
	@paddingRight.setter
	def paddingRight(self, state):
		self._setter_access_tracker["paddingRight"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._paddingRight = state
	@property
	def paddingLeft(self):
		self._getter_access_tracker["paddingLeft"] = {}
		return self._paddingLeft
	@paddingLeft.setter
	def paddingLeft(self, state):
		self._setter_access_tracker["paddingLeft"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._paddingLeft = state
	@property
	def width(self):
		self._getter_access_tracker["width"] = {}
		return self._width
	@width.setter
	def width(self, state):
		self._setter_access_tracker["width"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._width = state
	@property
	def height(self):
		self._getter_access_tracker["height"] = {}
		return self._height
	@height.setter
	def height(self, state):
		self._setter_access_tracker["height"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._height = state
	@property
	def minWidth(self):
		self._getter_access_tracker["minWidth"] = {}
		return self._minWidth
	@minWidth.setter
	def minWidth(self, state):
		self._setter_access_tracker["minWidth"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._minWidth = state
	@property
	def minHeight(self):
		self._getter_access_tracker["minHeight"] = {}
		return self._minHeight
	@minHeight.setter
	def minHeight(self, state):
		self._setter_access_tracker["minHeight"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._minHeight = state
	@property
	def maxWidth(self):
		self._getter_access_tracker["maxWidth"] = {}
		return self._maxWidth
	@maxWidth.setter
	def maxWidth(self, state):
		self._setter_access_tracker["maxWidth"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._maxWidth = state
	@property
	def maxHeight(self):
		self._getter_access_tracker["maxHeight"] = {}
		return self._maxHeight
	@maxHeight.setter
	def maxHeight(self, state):
		self._setter_access_tracker["maxHeight"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._maxHeight = state
	@property
	def overflow(self):
		self._getter_access_tracker["overflow"] = {}
		return self._overflow
	@overflow.setter
	def overflow(self, state):
		self._setter_access_tracker["overflow"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._overflow = state
	@property
	def fontFamily(self):
		self._getter_access_tracker["fontFamily"] = {}
		return self._fontFamily
	@fontFamily.setter
	def fontFamily(self, state):
		self._setter_access_tracker["fontFamily"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._fontFamily = state
	@property
	def fontWeight(self):
		self._getter_access_tracker["fontWeight"] = {}
		return self._fontWeight
	@fontWeight.setter
	def fontWeight(self, state):
		self._setter_access_tracker["fontWeight"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._fontWeight = state
	@property
	def fontSize(self):
		self._getter_access_tracker["fontSize"] = {}
		return self._fontSize
	@fontSize.setter
	def fontSize(self, state):
		self._setter_access_tracker["fontSize"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._fontSize = state
	@property
	def textAlign(self):
		self._getter_access_tracker["textAlign"] = {}
		return self._textAlign
	@textAlign.setter
	def textAlign(self, state):
		self._setter_access_tracker["textAlign"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._textAlign = state
	@property
	def color(self):
		self._getter_access_tracker["color"] = {}
		return self._color
	@color.setter
	def color(self, state):
		self._setter_access_tracker["color"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._color = state
	@property
	def opacity(self):
		self._getter_access_tracker["opacity"] = {}
		return self._opacity
	@opacity.setter
	def opacity(self, state):
		self._setter_access_tracker["opacity"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._opacity = state
	@property
	def fontStyle(self):
		self._getter_access_tracker["fontStyle"] = {}
		return self._fontStyle
	@fontStyle.setter
	def fontStyle(self, state):
		self._setter_access_tracker["fontStyle"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._fontStyle = state
	@property
	def borderRadius(self):
		self._getter_access_tracker["borderRadius"] = {}
		return self._borderRadius
	@borderRadius.setter
	def borderRadius(self, state):
		self._setter_access_tracker["borderRadius"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._borderRadius = state
	@property
	def borderWidth(self):
		self._getter_access_tracker["borderWidth"] = {}
		return self._borderWidth
	@borderWidth.setter
	def borderWidth(self, state):
		self._setter_access_tracker["borderWidth"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._borderWidth = state
	@property
	def borderStyle(self):
		self._getter_access_tracker["borderStyle"] = {}
		return self._borderStyle
	@borderStyle.setter
	def borderStyle(self, state):
		self._setter_access_tracker["borderStyle"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._borderStyle = state
	@property
	def borderColor(self):
		self._getter_access_tracker["borderColor"] = {}
		return self._borderColor
	@borderColor.setter
	def borderColor(self, state):
		self._setter_access_tracker["borderColor"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._borderColor = state
	@property
	def backgroundImage(self):
		self._getter_access_tracker["backgroundImage"] = {}
		return self._backgroundImage
	@backgroundImage.setter
	def backgroundImage(self, state):
		self._setter_access_tracker["backgroundImage"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._backgroundImage = state
	@property
	def backgroundColor(self):
		self._getter_access_tracker["backgroundColor"] = {}
		return self._backgroundColor
	@backgroundColor.setter
	def backgroundColor(self, state):
		self._setter_access_tracker["backgroundColor"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._backgroundColor = state
	@property
	def backgroundClip(self):
		self._getter_access_tracker["backgroundClip"] = {}
		return self._backgroundClip
	@backgroundClip.setter
	def backgroundClip(self, state):
		self._setter_access_tracker["backgroundClip"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._backgroundClip = state
	@property
	def backgroundOrigin(self):
		self._getter_access_tracker["backgroundOrigin"] = {}
		return self._backgroundOrigin
	@backgroundOrigin.setter
	def backgroundOrigin(self, state):
		self._setter_access_tracker["backgroundOrigin"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._backgroundOrigin = state
	@property
	def backgroundAttachment(self):
		self._getter_access_tracker["backgroundAttachment"] = {}
		return self._backgroundAttachment
	@backgroundAttachment.setter
	def backgroundAttachment(self, state):
		self._setter_access_tracker["backgroundAttachment"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._backgroundAttachment = state
	@property
	def backgroundPositionX(self):
		self._getter_access_tracker["backgroundPositionX"] = {}
		return self._backgroundPositionX
	@backgroundPositionX.setter
	def backgroundPositionX(self, state):
		self._setter_access_tracker["backgroundPositionX"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._backgroundPositionX = state
	@property
	def backgroundPositionY(self):
		self._getter_access_tracker["backgroundPositionY"] = {}
		return self._backgroundPositionY
	@backgroundPositionY.setter
	def backgroundPositionY(self, state):
		self._setter_access_tracker["backgroundPositionY"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._backgroundPositionY = state
	@property
	def backgroundRepeat(self):
		self._getter_access_tracker["backgroundRepeat"] = {}
		return self._backgroundRepeat
	@backgroundRepeat.setter
	def backgroundRepeat(self, state):
		self._setter_access_tracker["backgroundRepeat"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._backgroundRepeat = state
	@property
	def position(self):
		self._getter_access_tracker["position"] = {}
		return self._position
	@position.setter
	def position(self, state):
		self._setter_access_tracker["position"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._position = state
	@property
	def float(self):
		self._getter_access_tracker["float"] = {}
		return self._float
	@float.setter
	def float(self, state):
		self._setter_access_tracker["float"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._float = state
	@property
	def clear(self):
		self._getter_access_tracker["clear"] = {}
		return self._clear
	@clear.setter
	def clear(self, state):
		self._setter_access_tracker["clear"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._clear = state
	@property
	def top(self):
		self._getter_access_tracker["top"] = {}
		return self._top
	@top.setter
	def top(self, state):
		self._setter_access_tracker["top"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._top = state
	@property
	def left(self):
		self._getter_access_tracker["left"] = {}
		return self._left
	@left.setter
	def left(self, state):
		self._setter_access_tracker["left"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._left = state
	@property
	def bottom(self):
		self._getter_access_tracker["bottom"] = {}
		return self._bottom
	@bottom.setter
	def bottom(self, state):
		self._setter_access_tracker["bottom"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._bottom = state
	@property
	def right(self):
		self._getter_access_tracker["right"] = {}
		return self._right
	@right.setter
	def right(self, state):
		self._setter_access_tracker["right"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._right = state
	@property
	def zIndex(self):
		self._getter_access_tracker["zIndex"] = {}
		return self._zIndex
	@zIndex.setter
	def zIndex(self, state):
		self._setter_access_tracker["zIndex"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._zIndex = state
	@property
	def outlineStyle(self):
		self._getter_access_tracker["outlineStyle"] = {}
		return self._outlineStyle
	@outlineStyle.setter
	def outlineStyle(self, state):
		self._setter_access_tracker["outlineStyle"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._outlineStyle = state
	@property
	def outlineColor(self):
		self._getter_access_tracker["outlineColor"] = {}
		return self._outlineColor
	@outlineColor.setter
	def outlineColor(self, state):
		self._setter_access_tracker["outlineColor"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._outlineColor = state
	@property
	def outlineOffset(self):
		self._getter_access_tracker["outlineOffset"] = {}
		return self._outlineOffset
	@outlineOffset.setter
	def outlineOffset(self, state):
		self._setter_access_tracker["outlineOffset"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._outlineOffset = state
	@property
	def outlineWidth(self):
		self._getter_access_tracker["outlineWidth"] = {}
		return self._outlineWidth
	@outlineWidth.setter
	def outlineWidth(self, state):
		self._setter_access_tracker["outlineWidth"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._outlineWidth = state
	@property
	def cursor(self):
		self._getter_access_tracker["cursor"] = {}
		return self._cursor
	@cursor.setter
	def cursor(self, state):
		self._setter_access_tracker["cursor"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._cursor = state
	@property
	def boxSizing(self):
		self._getter_access_tracker["boxSizing"] = {}
		return self._boxSizing
	@boxSizing.setter
	def boxSizing(self, state):
		self._setter_access_tracker["boxSizing"] = {}
		if self._state_is_none == True and state != None:
			self._state_is_none = False
		self._boxSizing = state
	def _to_json_fields(self):
		# if the provided state is none, return empty dict
		if self._state_is_none == True:
			return {}
		return {
			"display": self._display,
			"flexDirection": self._flexDirection,
			"alignItems": self._alignItems,
			"justifyContent": self._justifyContent,
			"flexWrap": self._flexWrap,
			"alignContent": self._alignContent,
			"rowGap": self._rowGap,
			"columnGap": self._columnGap,
			"alignSelf": self._alignSelf,
			"flexGrow": self._flexGrow,
			"flexShrink": self._flexShrink,
			"order": self._order,
			"marginTop": self._marginTop,
			"marginBottom": self._marginBottom,
			"marginRight": self._marginRight,
			"marginLeft": self._marginLeft,
			"paddingTop": self._paddingTop,
			"paddingBottom": self._paddingBottom,
			"paddingRight": self._paddingRight,
			"paddingLeft": self._paddingLeft,
			"width": self._width,
			"height": self._height,
			"minWidth": self._minWidth,
			"minHeight": self._minHeight,
			"maxWidth": self._maxWidth,
			"maxHeight": self._maxHeight,
			"overflow": self._overflow,
			"fontFamily": self._fontFamily,
			"fontWeight": self._fontWeight,
			"fontSize": self._fontSize,
			"textAlign": self._textAlign,
			"color": self._color,
			"opacity": self._opacity,
			"fontStyle": self._fontStyle,
			"borderRadius": self._borderRadius,
			"borderWidth": self._borderWidth,
			"borderStyle": self._borderStyle,
			"borderColor": self._borderColor,
			"backgroundImage": self._backgroundImage,
			"backgroundColor": self._backgroundColor,
			"backgroundClip": self._backgroundClip,
			"backgroundOrigin": self._backgroundOrigin,
			"backgroundAttachment": self._backgroundAttachment,
			"backgroundPositionX": self._backgroundPositionX,
			"backgroundPositionY": self._backgroundPositionY,
			"backgroundRepeat": self._backgroundRepeat,
			"position": self._position,
			"float": self._float,
			"clear": self._clear,
			"top": self._top,
			"left": self._left,
			"bottom": self._bottom,
			"right": self._right,
			"zIndex": self._zIndex,
			"outlineStyle": self._outlineStyle,
			"outlineColor": self._outlineColor,
			"outlineOffset": self._outlineOffset,
			"outlineWidth": self._outlineWidth,
			"cursor": self._cursor,
			"boxSizing": self._boxSizing,
			}
