let socket = io();

$(function() {
  let loginbox = $("#loginbox"); //login elements
  let loginbtn = $("#loginbtn");
  let loginDiv = $("#login-div");

  let chatDiv = $("#chat-div");

  let room1_msglist = $("#room1_msglist"); //messages
  let room2_msglist = $("#room2_msglist");

  let room1_sendbtn = $("#room1_sendmsg"); //buttons
  let room2_sendbtn = $("#room2_sendmsg");

  let room1_msgbox = $("#room1_msgbox"); //message box(input)
  let room2_msgbox = $("#room2_msgbox");

  let room1_div = $("#room1"); //room divs
  let room2_div = $("#room2");

  let user = "";

  socket.on("connected", () => {
    console.log("Connected " + socket.id);
  });
  // socket.on("new_user", function(data){
  //     msglist.append($('<li>' + data +" is online" + '</li>'))
  // })

  loginbtn.click(function() {
    //clicking the login button, after which chatting starts,
    user = loginbox.val();
    chatDiv.show();
    loginDiv.hide();
    socket.emit("login", {
      user: user
    });
    var room1 = "room1";
    var room2 = "room2";
    socket.emit("room1", {
      room: room1,
      user: user
    });
    socket.emit("room2", {
      room: room2,
      user: user
    });
  });

  socket.on("online_message_room1", function(
    data //displaying who is online in room1
  ) {
    room1_msglist.append(
      $("<li>" + data.user + " has joined the chat" + "</li>")
    );
  });

  socket.on("online_message_room2", function(
    data //displaying who is online in room2
  ) {
    room2_msglist.append(
      $("<li>" + data.user + " has joined the chat" + "</li>")
    );
  });

  // sendbtn.click(function () {
  //     socket.emit('send_msg', {
  //         user: user,
  //         message: msgbox.val()
  //     })
  // })

  room1_sendbtn.click(function() {
    socket.emit("room1_send_msg", {
      user: user,
      message: room1_msgbox.val()
    });
  });

  room2_sendbtn.click(function() {
    socket.emit("room2_send_msg", {
      user: user,
      message: room2_msgbox.val()
    });
  });

  socket.on("room1_recv_msg", function(data) {
    room1_msglist.append($("<li>" + data.user + ": " + data.message + "</li>"));
  });

  socket.on("room2_recv_msg", function(data) {
    room2_msglist.append($("<li>" + data.user + ": " + data.message + "</li>"));
  });
});
