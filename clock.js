let totalSeconds = 300; // 5分钟
let lastUpdate = null;

function updateClock() {
  let now = millis();
  if (now - lastUpdate >= 1000 && totalSeconds > 0) {
    totalSeconds--;
    lastUpdate = now;
  }

  push();
  textAlign(CENTER, CENTER)
  translate(width - 50, 50);

  // 进度圆环
  let progress = totalSeconds / 300;
  let angle = map(progress, 0, 1, 0, TWO_PI);
  stroke(100, 200, 255);
  strokeWeight(5);
  noFill();
  arc(0, 0, 80, 80, -HALF_PI, angle - HALF_PI);

  // 显示时间
  let minutes = floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let timeStr = nf(minutes, 2) + ":" + nf(seconds, 2);

  fill(255);
  noStroke()
  textSize(26);
  text(timeStr, 0, 0);

  pop();

  // 结束提示
  if (totalSeconds <= 0) {
    background(0)
    fill('red');
    textSize(32);
    push()
    textAlign(CENTER, CENTER)
    text(overSound.text, width/2, height / 2);
    pop()

    playSound(overSound)
  }
}
