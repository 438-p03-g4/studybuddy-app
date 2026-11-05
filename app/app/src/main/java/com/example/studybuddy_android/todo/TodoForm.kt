package com.example.studybuddy_android.todo

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.studybuddy_android.R

@Composable
fun TodoCreationForm(onCreate: (TodoItem) -> Unit) {
    var title by rememberSaveable { mutableStateOf("") }
    var tag by rememberSaveable { mutableStateOf("") }
    val focusManager = LocalFocusManager.current
    val keyboard = LocalSoftwareKeyboardController.current
    val fieldColors = OutlinedTextFieldDefaults.colors(
        focusedTextColor = Color(0xFF242424),
        unfocusedTextColor = Color(0xFF242424),
        focusedLabelColor = Color(0xFF242424),
        unfocusedLabelColor = Color(0xFF777777),
        unfocusedPlaceholderColor = Color(0xFF777777),
        focusedPlaceholderColor = Color(0xFF777777),
        focusedBorderColor = Color(0xFFF46524),
        unfocusedBorderColor = Color(0xFF777777),
        cursorColor = Color(0xFFF46524),
    )

    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(
            text = stringResource(R.string.todo_heading),
            color = Color(0xFF242424),
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
        )
        OutlinedTextField(
            value = title,
            onValueChange = { title = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text(stringResource(R.string.todo_title)) },
            colors = fieldColors,
            singleLine = true,
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
        )
        OutlinedTextField(
            value = tag,
            onValueChange = { tag = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text(stringResource(R.string.todo_tag)) },
            placeholder = { Text(stringResource(R.string.todo_tag_example)) },
            colors = fieldColors,
            singleLine = true,
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
        )
        Button(
            onClick = {
                onCreate(TodoItem(title = title.trim(), tag = tag.trim()))
                title = ""
                tag = ""
                focusManager.clearFocus()
                keyboard?.hide()
            },
            enabled = title.isNotBlank(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF46524)),
        ) {
            Text(stringResource(R.string.todo_create))
        }
    }
}

@Composable
fun TodoListItem(item: TodoItem) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFFFFF7F2))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Text(item.title, color = Color(0xFF242424), fontWeight = FontWeight.Medium)
        if (item.tag.isNotEmpty()) {
            Text(
                text = item.tag,
                color = Color(0xFF242424),
                fontSize = 12.sp,
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFFFFE8DC))
                    .padding(horizontal = 10.dp, vertical = 4.dp),
            )
        }
    }
}
