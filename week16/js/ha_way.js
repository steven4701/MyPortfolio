/**
 * @author 蔡承洋
 */
$(document).ready(function() {
	/**
	 * 點擊選單，啟動active
	 * 概念：
	 * 針對每一個選單的li給予點擊事件，並判別自己是否啟動中，在處理要不要加上 active 類別
	 * 當然，也要比已經啟動的li給拿掉 active
	 */
	$("ul.nav li").on("click", function() {
		//在此function 裡面的 $(this) ，代表著是被選到的 li
		//判別自己是否為 active，如果不是，
		//就先把已經設定為active的li拿掉active類別，
		//之後在自己加入 active 類別
		if (!$(this).hasClass("active")) {
			//把以己啟動的，先拿掉active
			$("ul.nav li[class='active']").removeClass('active');
			//自己再加上 active 類別
			$(this).addClass("active");
		}
	});

	/**
	 * 點擊選單，捲動到該位置
	 * 概念：
	 * 當點擊選單中的超連結a時，抓取他href中要前往的目標id #xxx
	 * 找到後，用jquery選擇器找到目標id元素的 scrollTop() 位置y座標
	 * 然後透過jquery animate 方法，將html與body捲動到取得的目標y座標點
	 * 移動後執行一個callback，將點選的超連結，其父元素給予active類別
	 */
	$("ul.nav li a").on("click", function() {
		//取得要移動到哪個id
		var a_elm = $(this);
		var target_id = a_elm.attr("href");
		//要捲到的高度，預設為0
		var topTo = 0;
		//如果目標，id 不等於 #，代表是有設定其他錨點
		if (target_id != "#") {
			//topTo就等於要捲到的位置
			topTo = $(target_id).position().top;
		}
		//用jQuery animate方法，把html與body捲到適當的位置
		$("html, body").animate({
			scrollTop : topTo
		}, 600, function() {//移動速度為600毫秒，完成後做以下事情
			//把以己啟動的，先拿掉active
			$("ul.nav li[class='active']").removeClass('active');
			//該 a 選單元素的父元素(用.parent()方法取得上一層，並加上 active 類別
			a_elm.parent().addClass('active');
		});
		//回傳 false 代表是阻止 a 超連結前往的動作，不要讓他前往預設的連結
		return false;
	});

	/**
	 * 卷動視窗，背景跟著動
	 * 概念：
	 * 當背景區塊出現在視窗的可視範圍時，（換言之，將「不在視窗的狀態」反過來，就是在視窗內）
	 * 若捲軸往上捲，背景圖的background-position其y軸數值要用負號(-)往上減
	 * 若捲軸往下捲，background-position 其y軸數值要用正號往下加
	 * 前提，該元素的css background-position 須將 center 換成 50%，
	 * 因為數字才能計算
	 */
	//以一個變數儲存視窗捲動時的最後的高度，但由於一開始沒有捲動，所以就指派初始的視窗高度給他，
	//主要作為之後判別是往上捲還是往下捲的狀態用
	var window_last_scroll_top = $(window).scrollTop();
	//宣告一個變數，作為儲存目前捲動的方向
	var scroll_direction = '';
	//宣告一個空陣列變數
	var bg_y = [];
	//在根據背景區塊數量，設定存放每個背景區塊捲動y軸的距離百分比，預設為0％
	$("div.fix_bg").each(function(i) {
		bg_y[i] = 50;
		//不加上 %是因為要當成數字做計算
	});
	$(window).on("scroll", function() {
		//在此function 裡面的 $(this) ，代表著是被選到的 window
		//當視窗捲動的時候，每一個固定背景要偵測是否已經出現在可視區域
		//目前window的最上方已經捲到哪個地方了
		var window_top = $(this).scrollTop();
		//console.log("window 上方：" + $(this).scrollTop());
		//目前window的高度
		var window_height = $(this).height();
		//console.log("window 高度：" + $(this).height());
		//目前可視範圍底部
		var window_bottom = window_top + window_height;
		//console.log("目前瀏覽器可視範圍=>高：" + window_top + "底部：" + window_bottom);

		//判別是往上捲還是往下捲，並將方向存給 scroll_direction，等下會判別用
		//宣告一個變數，作為儲存目前視窗捲的高度。
		var current_top = $(this).scrollTop();
		//判別目前高度與最後的視窗高度比較
		if (current_top > window_last_scroll_top) {
			//若是目前高度，大於最後捲動的高度位置，代表視窗往下移動，（內容是往上捲），並將狀態存給 scroll_direction
			scroll_direction = 'down';
		} else {
			//反之是往下捲，並將狀態存給 scroll_direction
			scroll_direction = 'up';
		}
		//將目前的位置帶給最後捲動的紀錄中
		window_last_scroll_top = current_top;
		//根據每一個背景區塊，跑以下要做的事情
		$("div.fix_bg").each(function(i) {
			//在此function 裡面的 $(this) ，代表著是被選到的 .fixed_bg 區塊，不是window唷
			//背景區塊自己在網頁中開始的位置
			var bg_top = $(this).position().top;
			//console.log(i + " y:" + bg_top);
			//自己的高度
			var bg_height = $(this).height();
			//console.log(i + " h:" + $(this).height());
			//自己的範圍
			var bg_bottom = bg_top + bg_height;
			//console.log(i + " 位置範圍=>高：" + bg_top + "底部：" + bg_bottom);

			//開始判別，在目前視窗的可視範圍內，可以反過來想
			//條件1：當視窗下方小於區塊上方位置，為超出。
			//條件2：或者，當視窗上方大於區塊下方位置，也為超出。
			var is_out = (window_top > bg_bottom) || (window_bottom < bg_top);

			//使用 ! 作為反過來，那是在可視範圍內了
			if (!is_out) {
				//再來，判別是往上捲還是往下捲做不一樣的方向移動
				if (scroll_direction == 'down') {
					//視窗往下捲就加一個百分點
					$(this).css("background-position", "50% " + (bg_y[i] += 1) + "%");
				} else if (scroll_direction == 'up') {
					$(this).css("background-position", "50% " + (bg_y[i] -= 1) + "%");
				}
			}
		});
	});
});
