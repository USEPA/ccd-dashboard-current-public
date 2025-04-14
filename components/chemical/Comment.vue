<template>
  <div>
    <div class="comment">
      <span class="comment-details">{{ comment.comment }}</span><br>
      <span class="comment-date">User comment posted {{ dateFormat(new Date(comment.createdAt), 'MMMM dd, yyyy') }}</span>
    </div>
    <div v-if="comment.feedback" class="comment-feedback">
      <span class="comment-details">{{ comment.feedback }}</span><br>
      <span class="comment-date">Admin reply posted {{ comment.updatedAt ? dateFormat(new Date(comment.updatedAt), 'MMMM dd, yyyy') : '' }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Comment',
  props: {
    comment: {default: null, type: Object},
  },
  methods: {

  },
};
</script>

<style scoped>
  .comment-feedback {
    margin-left: 78px;
    margin-top: 10px;
    min-height: 50px;
    background-color: #fff;
    font-size: 12px;
    padding: 8px 8px;
    line-height: 1.5;
    border-color: #ddd;
    border: 1px solid #e6e6e6;
    border-bottom: 3px solid #dddddd;
    border-radius: 5px;
    overflow: hidden;
  }

  .comment {
    min-height: 50px;
    background-color: #fff;
    font-size: 12px;
    margin-right: 78px;
    padding: 8px 8px;
    line-height: 1.5;
    color: #9e9e9e;
    border-color: #ddd;
    border: 1px solid #e6e6e6;
    border-bottom: 3px solid #dddddd;
    border-radius: 5px;
    overflow: hidden;
  }

  .comment:hover {
    background-color: #fafafa;
  }

  .comment-feedback:hover {
    background-color: #fafafa;
  }

  .comment-details {
    float: left;
    color: #717171;
  }

  .comment-date {
  float: left;
  font-size: 12px;
  padding-left: 10px;
  color: #0E6993;
}
</style>
