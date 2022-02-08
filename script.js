// //////////////////////////////////////
//      TOAST
// //////////////////////////////////////
// initialize toast
const toast = new bootstrap.Toast($('#errorToast'));

// //////////////////////////////////////
//      ADD RULES BTN
// //////////////////////////////////////
$('#addRule').click(() => {
  // Get max row id and set new id
  const newid = findNewId($('#formTable tr'));

  // RULE TR
  const ruleTr = $('<tr></tr>', {
    id: 'rule-' + newid,
    'data-id': newid,
  });

  // loop through each td and create new elements
  $.each($('#formTable tbody tr:nth(0) td'), (i, el) => {
    let td;
    const curName = $(el).data('name');
    const children = $(el).children();

    // Create new td
    td = $('<td></td>', {
      'data-name': curName,
    });

    const c = $(el).find($(children[0])).clone();
    // Update collapse
    if (c.attr('data-bs-target')) {
      c.attr('data-bs-target', `.editor-collapse-${newid}`);
    }
    if (curName === 'rule-name') {
      $(c.find('input')).attr('required', true);
      $(c.children('.name-btn')).removeClass('editor-collapse-0').addClass(`editor-collapse-${newid}`);
    }
    // Update row id
    if (curName === 'number') {
      c.text(newid);
    }
    // Update data-id attr
    updateDataId(c, newid);

    c.appendTo($(td));
    td.appendTo($(ruleTr));
  });
  // EDITOR TR
  const editorTr = $('<tr></tr>', {
    id: 'editor-' + newid,
    'data-id': newid,
  });

  // loop through each td and create new elements
  $.each($('#formTable tbody tr:nth(1) td'), (i, el) => {
    let td;
    const children = $(el).children();

    // Create new td
    td = $('<td></td>', {
      'data-name': $(el).data('name'),
      colspan: '5',
      class: 'p-0',
      'data-name': 'editor',
    });

    const c = $(el).find($(children[0])).clone();
    // Update collapse
    $.each(c.find('[data-bs-target]'), (i, el) => {
      $(el).attr('data-bs-target', `.editor-collapse-${newid}`);
    });
    c.removeClass('editor-collapse-0').addClass(`editor-collapse-${newid}`);
    // Update data-id attr
    updateDataId(c, newid);

    // Add required to input + select elem
    $.each(c.find('input').add(c.find('select')), (i, el) => {
      $(el).attr('required', true);
    });

    c.appendTo($(td));
    td.appendTo($(editorTr));
  });

  // add the new rows and events
  $(ruleTr).appendTo($('#formTable'));
  $(editorTr).appendTo($('#formTable'));

  attachEvents();
  // Reset validation
  $('#form').removeClass('was-validated');
  // Check for disabling submit btn
  checkSubmit();
});

const createElem = () => {};

const updateDataId = (elem, id) => {
  let dataEl = elem.find('[data-id]');
  if (elem.attr('data-id')) {
    dataEl = elem.find('[data-id]').add(elem);
  }
  $.each(dataEl, (i, el) => {
    $(el).attr('data-id', id);
  });
};

// //////////////////////////////////////
//      EVENTS
// //////////////////////////////////////

const attachEvents = () => {
  // REMOVE RULE
  $('.remove-btn').off();
  $('.remove-btn').click(ev => {
    const targetId = $(ev.currentTarget).data('id');
    $(`tr#rule-${targetId}`).remove();
    $(`tr#editor-${targetId}`).remove();
    checkSubmit();
  });
  // NAME
  $('.name-btn').off();
  $('.name-btn').click(ev => {
    const targetId = $(ev.currentTarget).data('id');
    $(`.name-input[data-id=${targetId}]`)
      .removeClass('form-control-plaintext')
      .addClass('form-control')
      .attr('readonly', false);
    $(`.name-save[data-id=${targetId}]`).show();
  });
  // Name save
  $('.name-save').off();
  $('.name-save').click(ev => {
    ev.preventDefault();
    const targetId = $(ev.currentTarget).data('id');
    const val = $(`.name-input[data-id=${targetId}]`).val();
    // Check if value is empty and throw toast if it is
    if (!val) {
      $('#errorToast').children('.toast-body').text("Rule name can't be empty");
      toast.show();
      return;
    }
    $(`.name-input[data-id=${targetId}]`)
      .addClass('form-control-plaintext')
      .removeClass('form-control')
      .attr('readonly', true);
    $(`.name-save[data-id=${targetId}]`).hide();
  });
  // CONDITIONS
  addCondition();
  // ACTIONS
  addAction();
};

const addCondition = () => {
  $('.condition-add').off();
  $('.condition-add').click(ev => {
    ev.preventDefault();

    const targetId = $(ev.currentTarget).data('id');
    // Get max row id and set new id
    const newid = findNewId($(`.condition-row[data-id=${targetId}]`), 'cond');

    const c = $(`.condition-row[data-id=${targetId}]:first`).clone();
    // Reset value
    $.each(c.find('input'), (i, el) => {
      $(el).val('');
    });
    // Update cond id
    c.find('.condition-remove').attr('data-cond', newid);
    c.attr('data-cond', newid);
    // Show remove btn
    c.find('.remove-c-col').show();
    c.find('.add-c-col').hide();

    c.addClass('mt-2');
    c.appendTo($(`.conditions[data-id=${targetId}]`));
    removeCondtion();
  });
};

const removeCondtion = () => {
  $('.condition-remove').off();
  $('.condition-remove').click(ev => {
    ev.preventDefault();
    const targetId = $(ev.currentTarget).data('cond');
    const c = $(`.condition-row[data-cond=${targetId}]`);
    c.remove();
  });
};

const addAction = () => {
  $('.action-add').off();
  $('.action-add').click(ev => {
    ev.preventDefault();
    const targetId = $(ev.currentTarget).data('id');
    // Get max row id and set new id
    const newid = findNewId($(`.action-row[data-id=${targetId}]`), 'act');

    const c = $(`.action-row[data-id=${targetId}]:first`).clone();
    // Update act id
    c.attr('data-act', newid);
    c.find('.action-remove').attr('data-act', newid);

    // Reset value
    $.each(c.find('input'), (i, el) => {
      $(el).val('');
    });

    // Show remove btn
    c.find('.remove-a-col').show();
    c.find('.add-a-col').hide();

    c.appendTo($(`.actions[data-id=${targetId}]`));
    removeAction();
  });
};

const removeAction = () => {
  $('.action-remove').off();
  $('.action-remove').click(ev => {
    ev.preventDefault();
    const targetId = $(ev.currentTarget).data('act');
    $(`.action-row[data-act=${targetId}]`).remove();
  });
};

// //////////////////////////////////////
//      FORM SUBMIT
// //////////////////////////////////////

$('#form').submit(ev => {
  ev.preventDefault();
  const form = $('#form');
  if (form[0].checkValidity()) {
    const input = $('input:not([data-id=0])').add('select:not([data-id=0])');
    const resultObj = {};
    $.each(input, (i, el) => {
      const ruleId = $(el).data('id');
      const inputName = $(el).attr('name');
      if (!resultObj[`rule-${ruleId}`]) {
        resultObj[`rule-${ruleId}`] = {};
      }
      resultObj[`rule-${ruleId}`][inputName] = $(el).val();
    });
    // Log the results
    console.log(resultObj);
    form.removeClass('was-validated');
  } else {
    form.addClass('was-validated');
    $('#errorToast').children('.toast-body').text('Some rule have empty field(s) !');
    toast.show();
  }
});

// //////////////////////////////////////
//      HELPERS
// //////////////////////////////////////
const findNewId = (arr, data = 'id') => {
  // Get max row id and set new id
  let newid = 0;
  $.each(arr, (i, el) => {
    if (parseInt($(el).data(data)) > newid) {
      newid = parseInt($(el).data(data));
    }
  });
  return ++newid;
};

const checkSubmit = () => {
  if ($('[id^=rule-]:not(#rule-0)').length) {
    $('.submit-btn').attr('disabled', false);
  } else {
    $('.submit-btn').attr('disabled', true);
  }
};
