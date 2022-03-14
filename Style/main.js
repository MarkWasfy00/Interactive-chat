let commentAccess = {
  comments: document.querySelectorAll(".comment"),
  plusSign: document.querySelectorAll(".react .vote .bx-plus"),
  minusSign: document.querySelectorAll(".react .vote .bx-minus"),
  deleteBtn: document.querySelectorAll(".you-section .delete"),
  editBtn: document.querySelectorAll(".you-section .edit"),
  updateBtn: document.querySelectorAll(".update"),
  replyBtn: document.querySelectorAll(".reply-btn"),

  removeAllChildNodes: function (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  },

  addLikes: function (ele) {
    if (!ele.classList.contains("disabled")) {
      let plusBtn = ele.parentNode.querySelector(".count");
      plusBtn.innerHTML = parseInt(plusBtn.innerHTML) + 1;
      ele.classList.add("disabled");
      ele.parentNode.querySelector(".bx-minus").classList.remove("disabled");
    }
  },

  removeLikes: function (ele) {
    if (!ele.classList.contains("disabled")) {
      let plusBtn = ele.parentNode.querySelector(".count");
      plusBtn.innerHTML = parseInt(plusBtn.innerHTML) - 1;
      ele.classList.add("disabled");
      ele.parentNode.querySelector(".bx-plus").classList.remove("disabled");
    }
  },

  deleteComment: function (ele) {
    let comment = ele.parentNode.parentNode.parentNode.parentNode.parentNode;

    if (comment.parentNode.children.length > 1) {
      comment.remove();
    } else {
      comment.parentNode.parentNode.remove();
    }
  },

  editComment: function (ele) {
    let grandParent = ele.parentNode.parentNode.parentNode.parentNode; // Not Best Practice but no many choices here :D
    let contentToEdit = grandParent.querySelector(".content");
    let updateBtnDummy = document.createElement("a");

    contentToEdit.setAttribute("contenteditable", "true");
    updateBtnDummy.classList.add("update", "bold");
    updateBtnDummy.innerHTML = "UPDATE";
    ele.classList.add("disabled");
    ele.onclick = null;
    updateBtnDummy.onclick = function () {
      commentAccess.updateComment(grandParent);
      ele.classList.remove("disabled");
      ele.onclick = function () {
        commentAccess.editComment(ele);
      };
    };
    grandParent.appendChild(updateBtnDummy);
    contentToEdit.focus();
  },

  updateComment: function (ele) {
    let paragraph = ele.querySelector(".content");
    let updateBtn = ele.querySelector(".update");
    paragraph.removeAttribute("contenteditable");
    commentAccess.mentionFilter(ele);
    updateBtn.remove();
  },

  replyTo: function (ele) {
    let copyReply = document.querySelector(".reply-to").cloneNode(true);
    let comment = ele.parentNode.parentNode.parentNode.parentNode;
    let name = ele.parentNode.parentNode.querySelector(".name");
    let replySection = document.createElement("section");

    replySection.innerHTML = `<div class="avatar">
      <img src="./images/avatars/image-juliusomo.png" alt="avatar">
    </div>
    <textarea class="regular" id="textarea"></textarea>
      <a class="button bold" href="#">REPLY</a>`;
    replySection.classList.add("enter-reply", "reply-comment");

    replySection.querySelector("#textarea").value = `@${name.innerHTML} `;

    replySection.querySelector(".button").onclick = function (track) {
      if (
        replySection.querySelector("#textarea").value.length >
        `@${name.innerHTML} `.length
      ) {
        sendAccess.sendComment(track.target);
        ele.classList.remove("disabled");
        ele.onclick = function () {
          commentAccess.replyTo(ele);
        };
      }
    };

    commentAccess.removeAllChildNodes(copyReply.querySelector(".reply-holder"));

    //###### CHECKS IF COMMENT OR REPLY #############
    if (comment.classList.contains("reply-comment")) {
      comment.parentNode.appendChild(replySection);
    } else {
      if (comment.nextElementSibling.classList.contains("reply-to")) {
        comment.nextElementSibling
          .querySelector(".reply-holder")
          .appendChild(replySection);
      } else {
        comment.after(copyReply);
        copyReply.querySelector(".reply-holder").appendChild(replySection);
      }
    }
    ele.classList.add("disabled");
    ele.onclick = null;
  },

  deleteMsg: function (ele) {
    let msg = document.createElement("div");
    msg.innerHTML = `<div class="delete-me bold">Delete Comment</div>
    <div class="warn regular">Are you sure you want to delete this comment? This will remove the comment and can't be undone</div>
    <div class="choices">
      <div class="cancel choice-btn bold">NO, CANCEL</div>
      <div class="delete choice-btn bold">YES, DELETE</div>
    </div>`;
    msg.classList.add("delete-msg");
    document.body.classList.add("offshadow");
    document.querySelector(".container").appendChild(msg);

    msg.querySelector(".cancel").onclick = function () {
      document.body.classList.remove("offshadow");
      document.querySelector(".container").removeChild(msg);
    };

    msg.querySelector(".delete").onclick = function () {
      commentAccess.deleteComment(ele);
      document.body.classList.remove("offshadow");
      document.querySelector(".container").removeChild(msg);
    };
  },

  mentionFilter: function (ele) {
    let paragraph = ele.querySelector(".content");
    let checker = paragraph.innerHTML
      .split(" ")
      .map(function (word) {
        if (word[0] === "@") {
          return `<span class='callmeblue'>${word}</span>`;
        } else {
          return word;
        }
      })
      .join(" ");
    paragraph.innerHTML = checker;
  },
};

let sendAccess = {
  sendBtn: document.querySelectorAll(".button"),

  sendComment: function (ele) {
    let comment = ele.parentNode.querySelector("#textarea");
    let dummyDiv = document.createElement("section");
    let commentDeafult = `<div class="react">
      <div class="vote bolder">
        <i class='bx bx-plus disabled' ></i>
        <div class="count">0</div>
        <i class='bx bx-minus disabled' ></i>
      </div>
    </div>
    <div class="head">
      <div class="info">
        <div class="avatar">
          <img src="./images/avatars/image-juliusomo.png" alt="avatar">
        </div>
        <div class="name bold">juliusomo</div>
        <div class="badge small">you</div>
        <div class="date regular">few seconds ago</div>
        <div class="access-buttons">
          <div class="you-section">
            <div class="delete bold">
              <i class='bx bxs-trash' ></i>
              <div>Delete</div>
            </div>
            <div class="edit bold">
              <i class='bx bxs-edit-alt' ></i>
              <div>Edit</div>
            </div>
          </div>
        </div>
      </div>
      <p class="content regular">
        ${comment.value}
      </p>
    </div>`;
    comment.value = "";
    dummyDiv.classList.add("comment");
    dummyDiv.innerHTML = commentDeafult;
    //################### FILTER MENTION SIGN ####################
    commentAccess.mentionFilter(dummyDiv);
    //####################### Add onclick events to Dummy Div ###########
    dummyDiv.querySelector(".delete").onclick = function (track) {
      commentAccess.deleteMsg(track.target.parentNode);
    };
    dummyDiv.querySelector(".edit").onclick = function (track) {
      console.log(track);
      commentAccess.editComment(track.target.parentNode);
    };
    //###### Append dummy to the document ###################
    // and checks if it is coming from reply or send
    if (ele.parentNode.classList.contains("enter-comment")) {
      ele.parentNode.before(dummyDiv);
    } else {
      dummyDiv.classList.add("reply-comment");
      ele.parentNode.replaceWith(dummyDiv);
    }
  },
};

//##################### EVENT LISTENERS #################################################

commentAccess.comments.forEach(function (comment) {
  commentAccess.mentionFilter(comment);
});

commentAccess.plusSign.forEach(function (ele) {
  // onclick listener for + button
  ele.onclick = function () {
    commentAccess.addLikes(ele);
  };
});

commentAccess.minusSign.forEach(function (ele) {
  // onclick listener for - button
  ele.onclick = function () {
    commentAccess.removeLikes(ele);
  };
});

commentAccess.deleteBtn.forEach(function (ele) {
  // onclick listener for delete button
  ele.addEventListener("click", function () {
    commentAccess.deleteMsg(ele);
  });
});

commentAccess.editBtn.forEach(function (ele) {
  // onclick listener for edit button
  ele.onclick = function () {
    commentAccess.editComment(ele);
  };
});

commentAccess.replyBtn.forEach(function (ele) {
  // onclick listener for reply button
  ele.onclick = function () {
    commentAccess.replyTo(ele);
  };
});

sendAccess.sendBtn.forEach(function (ele) {
  ele.onclick = function () {
    // onclick listener for send button
    ele.style.pointerEvents = "none";
    ele.parentNode.style.opacity = ".5";
    if (ele.parentNode.querySelector("#textarea").value.length > 0) {
      // checks if content is not empty
      setTimeout(function () {
        // set time out for Loading Animation
        sendAccess.sendComment(ele);
        ele.parentNode.style.opacity = "1";
        ele.style.pointerEvents = "auto";
      }, 3000); // <= number of loading time
    } else {
      ele.parentNode.style.opacity = "1";
      ele.style.pointerEvents = "auto";
    }
  };
});
