**[简体中文](README.md)** | **[English](README-en.md)** | **Русский**
# Gmeek

Gmeek это блог генератор, использующий `Github Pages` и `Github Issues` и `Github Actions`. Никакого локального развертывания не требуется, и развертывание занимает всего несколько минут.

- [Пример](http://meekdai.github.io/)
- [Журнал обновлений](https://meekdai.github.io/post/Gmeek-geng-xin-ri-zhi.html)
- [Начать работу с Gmeek](https://blog.meekdai.com/post/Gmeek-kuai-su-shang-shou.html)

![dark](img/dark.jpg)

### Установка
1. Нажмите [Create a repository from template](https://github.com/new?template_name=Gmeek-template&template_owner=Meekdai), рекомендуемое имя репозитория - `XXX.github.io`, где `XXX` это имя вашего профиля github.

2. В репозитории выберите `Settings`, выберите `Github Actions` в следующем месте `Pages->Build and deployment->Source`.

3. Откройте issue и начните писать, далее добавьте label. После сохранения issue, содержание блога будет создано автоматически. Через некоторое время к нему можно будет получить доступ через https://XXX.github.io

Приведенная выше установка является лишь кратким руководством, некоторые детали конфигурации будут написаны позже. Если у вас есть вопросы, пожалуйста, отправьте [Issues](https://github.com/Meekdai/Gmeek/issues) в этот репозиторий.

### Особенности

- Интерфейс UI имеет то же происхождение, что и Github, только внедрен собственный CSS Github：[primer.style](https://primer.style/css)
- После завершения написания блога в Issues автоматически запускаются Actions для выполнения задач развертывания.
- Система комментариев, используется [utteranc.es](https://utteranc.es/)

### Благодарность
- [jinja2](https://jinja.palletsprojects.com/)
- [utteranc.es](https://utteranc.es/)
- [primer.style](https://primer.style/css)
- [gitblog](https://github.com/yihong0618/gitblog)
